package operatorapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/minio/console/models"
	"github.com/nats-io/nats.go"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"
)

type SubnetRegister struct {
	API string
}

type SubnetRequest struct {
	Url     string
	Method  string
	ReplyTo string
	Headers map[string][]string
	Topic   string
	Body    []byte
}

type SubnetResponse struct {
	Order   uint32
	Last    bool
	Headers map[string][]string
	Status  int
	Body    []byte
}

func Subnet() {
	// Subscribe to Global Console

	// generate a "customer id" simulating the API
	siteName := fmt.Sprintf("site%d", rand.Intn(1000000))
	if os.Getenv("CONSOLE_SITE_NAME") != "" {
		siteName = os.Getenv("CONSOLE_SITE_NAME")
	}

	go func() {

		serveraddr := "nats://127.0.0.1:1222"
		serveraddr = "nats://2.tcp.ngrok.io:15282"

		servers := []string{serveraddr}

		nc, err := nats.Connect(strings.Join(servers, ","))
		if err != nil {
			log.Fatal(err)
		}
		defer nc.Close()

		ec, err := nats.NewEncodedConn(nc, nats.GOB_ENCODER)
		if err != nil {
			log.Fatal(err)
		}
		defer ec.Close()

		// register with global
		rMsg := SubnetRegister{
			API: siteName,
		}
		err = ec.Publish("subnet", &rMsg)
		if err != nil {
			log.Println(err)
			return
		}
		// send the message immediately
		err = ec.Flush()
		if err != nil {
			log.Println(err)
			return
		}
		// not ping every 1 second
		go func() {
			for {
				// register with global
				rMsg := SubnetRegister{
					API: siteName,
				}
				err = ec.Publish("subnet", &rMsg)
				if err != nil {
					log.Println(err)
					return
				}
				time.Sleep(1 * time.Second)
			}
		}()

		authCh := authReqs(nc, siteName)

		waitForNatsCh := make(chan interface{})

		// Subscribe
		if _, err := ec.Subscribe(siteName, func(m *SubnetRequest) {

			log.Println("Received message, ", m.Url)

			// beam response

			client := &http.Client{
				Timeout: 2 * time.Second,
			}
			// get login credentials
			endUrl := fmt.Sprintf("http://localhost:9090%s", m.Url)

			var body io.Reader
			if len(m.Body) > 0 {
				body = bytes.NewReader(m.Body)
			}

			request, err := http.NewRequest(m.Method, endUrl, body)
			if err != nil {
				log.Println(err)
				return
			}

			//request.Header.Add("Content-Type", "application/json")
			for name, headers := range m.Headers {
				for _, h := range headers {
					request.Header.Add(name, h)
				}
			}

			response, err := client.Do(request)

			if err != nil {
				log.Println(err)
				return
			}

			if response != nil {

				rMsg := SubnetResponse{
					Order:   0,
					Headers: response.Header,
					Status:  response.StatusCode,
				}
				err = ec.Publish(m.Topic, &rMsg)
				//err = ec.PublishRequest(m.Topic, fmt.Sprintf("%s-reply", m.Topic), &rMsg)
				if err != nil {
					log.Println(err)
					return
				}
				// send headers immediately
				err := ec.Flush()
				if err != nil {
					log.Println(err)
					return
				}

				var chunkIndex uint32 = 1
				buf := make([]byte, 0, 900*1024)
				for {
					n, err := response.Body.Read(buf[:cap(buf)])
					buf = buf[:n]
					if n == 0 {
						if err == nil {
							continue
						}
						if err == io.EOF {

							rMsg := SubnetResponse{
								Last:  true,
								Order: chunkIndex,
							}
							err := ec.Publish(m.Topic, &rMsg)
							if err != nil {
								log.Println(err)
								return
							}

							break
						}
						log.Fatal(err)
					}

					// process buf
					if err != nil && err != io.EOF {
						log.Fatal(err)
					}

					rMsg := SubnetResponse{
						Order: chunkIndex,
						Body:  buf,
					}
					err = ec.Publish(m.Topic, &rMsg)
					if err != nil {
						log.Println(err)
						return
					}
					chunkIndex++

				}
			}

		}); err != nil {
			log.Println("NATS subscription closed")
			log.Println(err)
			close(waitForNatsCh)
		}

		// Do something with the connection
		<-waitForNatsCh
		<-authCh
		log.Println("nats done")
	}()
}

func authReqs(nc *nats.Conn, siteName string) chan interface{} {
	waitForNatsCh := make(chan interface{})

	// Subscribe
	if _, err := nc.Subscribe(fmt.Sprintf("%s-auth", siteName), func(m *nats.Msg) {

		log.Println(string(m.Data))
		var req SubnetRequest

		err := json.Unmarshal(m.Data, &req)
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Received auth message, ", req.ReplyTo)

		tempToekn := "eyJhbGciOiJSUzI1NiIsImtpZCI6Ik53dkhLVVpwNi0yc0hjWHZTR3lNQUtubFlhbkl6bFR2TlZqbHVMdU5nSlUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJtaW5pby1vcGVyYXRvciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJjb25zb2xlLXNhLXRva2VuLXNidDVxIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImNvbnNvbGUtc2EiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI1NjgyYzQwNS1mNjNkLTQyMWEtYmU1Yi05ZTY5YjQwZmQzMmUiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6bWluaW8tb3BlcmF0b3I6Y29uc29sZS1zYSJ9.BlswyDQv45SiOiJ_0ZOY-ZddJpDqkkbu7eSVdCxPxXwLGdG9TZOuxC_ewrMIUWU57VUXdiAX0cEFTdceYFLYRCxYgWBcj-81_0QSvHe3rt7OMmXOej1ErW4FHZm__DeE9KQjd4KhH5n8jhe3pFb3dMgwvTKqj9O45T60IIA-bV-6xiMohI6jc5xlpCteDoH1nU_YAzpFPjzYzxdMbglk_AaFz9sa1Ylf_a9r_8ZBfr7I8t_gAyImOLkZooBCTw4vtyxj7jOhJQYEsYXaDdir5UR-xOvv7dIabApPBIxaOs1vAjpwmoZPiDAt4vHX8tKPw1sIuJKDFYFjc23O2OOjWQ"
		resp, errx := getLoginOperatorResponse(&models.LoginOperatorRequest{Jwt: &tempToekn})
		if errx != nil {
			log.Println("ERROR LOGIN?!")
		}

		tokenResp := SubnetRegister{
			API: resp.SessionID,
		}
		tsj, _ := json.Marshal(tokenResp)

		err = nc.Publish(req.ReplyTo, tsj)
		if err != nil {
			log.Println("ASDSD", err)
			return
		}
		err = nc.Flush()
		if err != nil {
			log.Println("zxczx", err)
			return
		}

	}); err != nil {
		log.Println("NATS subscription closed")
		log.Println(err)
		close(waitForNatsCh)
	}

	// Do something with the connection
	return waitForNatsCh
}
