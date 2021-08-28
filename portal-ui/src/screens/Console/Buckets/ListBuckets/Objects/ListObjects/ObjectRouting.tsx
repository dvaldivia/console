// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useEffect, useRef, useState } from "react";
import ListObjects from "./ListObjects";
import ObjectDetails from "../ObjectDetails/ObjectDetails";
import get from "lodash/get";
import { resetRewind, setAllRoutes } from "../../../../ObjectBrowser/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ObjectBrowserState, Route } from "../../../../ObjectBrowser/reducers";
import api from "../../../../../../common/api";
import {
  BucketObject,
  BucketObjectsList,
  RewindObject,
  RewindObjectList,
} from "./types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../../actions";
import { Typography } from "@material-ui/core";
import { BucketVersioning } from "../../../types";

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface ObjectRoutingProps {
  routesList: Route[];
  setAllRoutes: (path: string) => any;
  match: any;
  rewindEnabled: boolean;
  rewindDate: any;
  resetRewind: typeof resetRewind;
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback !== undefined && savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const defLoading = <Typography component="h3">Loading...</Typography>;

const ObjectRouting = ({
  routesList,
  match,
  setAllRoutes,
  rewindEnabled,
  rewindDate,
  resetRewind,
}: ObjectRoutingProps) => {
  // const currentItem = routesList[routesList.length - 1];
  const [records, setRecords] = useState<BucketObject[]>([]);
  const [rewind, setRewind] = useState<RewindObject[]>([]);
  const [currentItem, setCurrentItem] = useState<string>("path");
  const [currentUrl, setCurrentUrl] = useState<string>("path");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRewind, setLoadingRewind] = useState<boolean>(true);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] =
    useState<React.ReactNode>(defLoading);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);

  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const bucketName = match.params["bucketName"];

  const updateMessage = () => {
    let timeDelta = Date.now() - loadingStartTime;

    if (timeDelta / 1000 >= 6) {
      setLoadingMessage(
        <React.Fragment>
          <Typography component="h3">
            This operation is taking longer than expected... (
            {Math.ceil(timeDelta / 1000)}s)
          </Typography>
        </React.Fragment>
      );
    } else if (timeDelta / 1000 >= 3) {
      setLoadingMessage(
        <Typography component="h3">
          This operation is taking longer than expected...
        </Typography>
      );
    }
  };

  useInterval(() => {
    // Your custom logic here
    if (loading) {
      updateMessage();
    }
  }, 1000);

  // only load stuff on match change
  useEffect(() => {
    setCurrentItem("path");
    const url = get(match, "url", `/buckets/${bucketName}/browse`);
    console.log(`${url}`, "vs", currentUrl);
    if (`${url}` !== currentUrl) {
      console.log("processing", url);
      setCurrentUrl(url);
      setLoading(true);
    }
  }, [match, setLoading]);

  const getInternalPaths = (): string => {
    //we will ignore anything after the first 3 elements of the routing URL
    const url = get(match, "url", `/buckets/${bucketName}/browse`);
    let urlParts = url.split("/");
    const intenrla = urlParts
      .filter((x: string, i: number) => {
        return i > 3 && x.trim() !== "";
      })
      .join("/");
    return intenrla;
  };

  const internalPaths = getInternalPaths();

  useEffect(() => {
    if (loading) {
      console.log("match3 loading", loading, internalPaths, match);
      const verifyIfIsFile = (intPaths: string) => {
        console.log("verify", intPaths);
        if (rewindEnabled) {
          console.log("we rewinding?!");
          const rewindParsed = rewindDate.toISOString();
          api
            .invoke(
              "GET",
              `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}?prefix=${
                intPaths ? `${intPaths}/` : ""
              }`
            )
            .then((res: RewindObjectList) => {
              //It is a file since it has elements in the object, setting file flag and waiting for component mount
              if (res.objects === null) {
                setCurrentItem("file");
              } else {
                // It is a folder, we remove loader
                setCurrentItem("path");
                setLoadingRewind(false);
                setLoading(false);
              }
            })
            .catch((err: ErrorResponseHandler) => {
              setLoadingRewind(false);
              setLoading(false);
              setErrorSnackMessage(err);
            });
        } else {
          console.log(`intPaths GO`, intPaths);
          api
            .invoke(
              "GET",
              `/api/v1/buckets/${bucketName}/objects?prefix=${intPaths}`
            )
            .then((res: BucketObjectsList) => {
              //It is a file since it has elements in the object, setting file flag and waiting for component mount
              if (res.objects !== null) {
                setCurrentItem("file");
                console.log("qweqwe", res);
              } else {
                // It is a folder, we remove loader
                console.log("asdasda" + "");
                setCurrentItem("path");
                setLoading(false);
              }
            })
            .catch((err: ErrorResponseHandler) => {
              setLoading(false);
              console.log("zxczxc" + "");
              setErrorSnackMessage(err);
            });
        }
      };

      console.log("match4", match);
      let extraPath = "";
      if (internalPaths) {
        extraPath = `?prefix=${internalPaths}/`;
      }

      console.log(`internalPathsx2`, internalPaths);

      let currentTimestamp = Date.now() + 0;
      setLoadingStartTime(currentTimestamp);
      setLoadingMessage(defLoading);

      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/objects${extraPath}`)
        .then((res: BucketObjectsList) => {
          const records: BucketObject[] = res.objects || [];
          const folders: BucketObject[] = [];
          const files: BucketObject[] = [];

          records.forEach((record) => {
            // this is a folder
            if (record.name.endsWith("/")) {
              folders.push(record);
            } else {
              // this is a file
              files.push(record);
            }
          });

          const recordsInElement = [...folders, ...files];

          setRecords(recordsInElement);
          // In case no objects were retrieved, We check if item is a file
          if (!res.objects && extraPath !== "") {
            verifyIfIsFile(internalPaths);
            return;
          }
          setCurrentItem("path");
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    match,
    loading,
    setErrorSnackMessage,
    bucketName,
    rewindEnabled,
    rewindDate,
  ]);

  useEffect(() => {
    if (loadingVersioning) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
        .then((res: BucketVersioning) => {
          setIsVersioned(res.is_versioned);
          setLoadingVersioning(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setLoadingVersioning(false);
        });
    }
  }, [bucketName, loadingVersioning, setErrorSnackMessage]);

  // Rewind
  useEffect(() => {
    if (rewindEnabled) {
      // if (bucketToRewind !== bucketName) {
      //   resetRewind();
      //   return;
      // }

      if (rewindDate) {
        setLoadingRewind(true);
        const rewindParsed = rewindDate.toISOString();

        api
          .invoke(
            "GET",
            `/api/v1/buckets/${bucketName}/rewind/${rewindParsed}?prefix=${
              internalPaths ? `${internalPaths}/` : ""
            }`
          )
          .then((res: RewindObjectList) => {
            setLoadingRewind(false);
            if (res.objects) {
              setRewind(res.objects);
            } else {
              setRewind([]);
            }
          })
          .catch((err: ErrorResponseHandler) => {
            setLoadingRewind(false);
            setErrorSnackMessage(err);
          });
      }
    }
  }, [
    rewindEnabled,
    rewindDate,
    bucketName,
    match,
    setErrorSnackMessage,
    resetRewind,
  ]);

  return currentItem === "path" ? (
    <ListObjects
      match={match}
      records={records}
      rewind={rewind}
      loading={loading}
      loadingRewind={loadingRewind}
      setLoading={setLoading}
      bucketName={bucketName}
      internalPaths={internalPaths}
      isVersioned={isVersioned}
    />
  ) : (
    <ObjectDetails bucketName={bucketName} internalPaths={internalPaths} />
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  routesList: get(objectBrowser, "routesList", []),
  rewindEnabled: objectBrowser.rewind.rewindEnabled,
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
});

const mapDispatchToProps = {
  setAllRoutes,
  resetRewind,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(ObjectRouting));
