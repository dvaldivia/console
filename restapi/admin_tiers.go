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

package restapi

import (
	"context"
	"log"
	"time"

	"github.com/minio/minio/pkg/madmin"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerAdminTiersHandlers(api *operations.ConsoleAPI) {
	// return a list of notification endpoints
	api.AdminAPITiersListHandler = admin_api.TiersListHandlerFunc(func(params admin_api.TiersListParams, session *models.Principal) middleware.Responder {
		tierList, err := getTiersResponse(session)
		if err != nil {
			return admin_api.NewNotificationEndpointListDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewTiersListOK().WithPayload(tierList)
	})
	// add a new notification endpoints
	api.AdminAPIAddTierHandler = admin_api.AddTierHandlerFunc(func(params admin_api.AddTierParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getAddTierResponse(session, &params)
		if err != nil {
			return admin_api.NewAddTierDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAddTierCreated().WithPayload(notifEndpoints)
	})
	// add a new notification endpoints
	api.AdminAPIGetTierHandler = admin_api.GetTierHandlerFunc(func(params admin_api.GetTierParams, session *models.Principal) middleware.Responder {
		notifEndpoints, err := getGetTierResponse(session, &params)
		if err != nil {
			return admin_api.NewGetTierDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewGetTierOK().WithPayload(notifEndpoints)
	})
	// edit credentials for a tier
	api.AdminAPIEditTierCredentialsHandler = admin_api.EditTierCredentialsHandlerFunc(func(params admin_api.EditTierCredentialsParams, session *models.Principal) middleware.Responder {
		err := getEditTierCredentialsResponse(session, &params)
		if err != nil {
			return admin_api.NewEditTierCredentialsDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewEditTierCredentialsOK()
	})

}

// getNotificationEndpoints invokes admin info and returns a list of notification endpoints
func getTiers(ctx context.Context, client MinioAdmin) (*models.TierListResponse, error) {
	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}
	var tiersList []*models.Tier
	for i := range tiers {

		switch tiers[i].Type {
		case madmin.S3:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeS3,
				S3: &models.TierS3{
					Accesskey:    tiers[i].S3.AccessKey,
					Bucket:       tiers[i].S3.Bucket,
					Endpoint:     tiers[i].S3.Endpoint,
					Name:         tiers[i].S3.Name,
					Prefix:       tiers[i].S3.Prefix,
					Region:       tiers[i].S3.Region,
					Secretkey:    tiers[i].S3.SecretKey,
					Storageclass: tiers[i].S3.StorageClass,
				},
			})
		case madmin.GCS:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeGcs,
				Gcs: &models.TierGcs{
					Bucket:       tiers[i].GCS.Bucket,
					Creds:        tiers[i].GCS.Creds,
					Endpoint:     tiers[i].GCS.Endpoint,
					Name:         tiers[i].GCS.Name,
					Prefix:       tiers[i].GCS.Prefix,
					Region:       tiers[i].GCS.Region,
					Storageclass: tiers[i].GCS.StorageClass,
				},
			})
		case madmin.Azure:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeAzure,
				Azure: &models.TierAzure{
					Accountkey:   tiers[i].Azure.AccountKey,
					Accountname:  tiers[i].Azure.AccountName,
					Bucket:       tiers[i].Azure.Bucket,
					Endpoint:     tiers[i].Azure.Endpoint,
					Name:         tiers[i].Azure.Name,
					Prefix:       tiers[i].Azure.Prefix,
					Region:       tiers[i].Azure.Region,
					Storageclass: tiers[i].Azure.StorageClass,
				},
			})
		case madmin.Unsupported:
			tiersList = append(tiersList, &models.Tier{
				Type: models.TierTypeUnsupported,
			})

		}
	}

	// build response
	return &models.TierListResponse{
		Items: tiersList,
	}, nil
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getTiersResponse(session *models.Principal) (*models.TierListResponse, *models.Error) {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	tiersResp, err := getTiers(ctx, adminClient)
	if err != nil {
		return nil, prepareError(err)
	}
	return tiersResp, nil
}

func addTier(ctx context.Context, client MinioAdmin, params *admin_api.AddTierParams) (*models.Tier, error) {

	var cfg *madmin.TierConfig
	var err error

	switch params.Body.Type {
	case models.TierTypeS3:
		cfg, err = madmin.NewTierS3(
			params.Body.S3.Name,
			params.Body.S3.Accesskey,
			params.Body.S3.Secretkey,
			params.Body.S3.Bucket,
			madmin.S3Region(params.Body.S3.Region),
			madmin.S3Prefix(params.Body.S3.Prefix),
			madmin.S3Endpoint(params.Body.S3.Endpoint),
			madmin.S3StorageClass(params.Body.S3.Storageclass),
		)
		if err != nil {
			return nil, err
		}
	case models.TierTypeGcs:
		cfg, err = madmin.NewTierGCS(
			params.Body.Gcs.Name,
			[]byte(params.Body.Gcs.Creds),
			params.Body.Gcs.Bucket,
			madmin.GCSPrefix(params.Body.Gcs.Prefix),
			madmin.GCSRegion(params.Body.Gcs.Region),
			madmin.GCSStorageClass(params.Body.Gcs.Storageclass),
		)
		if err != nil {
			return nil, err
		}
	case models.TierTypeAzure:
		cfg, err = madmin.NewTierAzure(
			params.Body.Azure.Name,
			params.Body.Azure.Accountname,
			params.Body.Azure.Accountkey,
			params.Body.Azure.Bucket,
			madmin.AzurePrefix(params.Body.Azure.Prefix),
			madmin.AzureEndpoint(params.Body.Azure.Endpoint),
			madmin.AzureRegion(params.Body.Azure.Region),
			madmin.AzureStorageClass(params.Body.Azure.Storageclass),
		)
		if err != nil {
			return nil, err
		}
	case models.TierTypeUnsupported:
		cfg = &madmin.TierConfig{
			Type: madmin.Unsupported,
		}

	}

	err = client.addTier(ctx, cfg)
	if err != nil {
		return nil, err
	}
	return params.Body, nil
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getAddTierResponse(session *models.Principal, params *admin_api.AddTierParams) (*models.Tier, *models.Error) {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	addTierResp, err := addTier(ctx, adminClient, params)
	if err != nil {
		log.Println("error here")
		return nil, prepareError(err)
	}
	return addTierResp, nil
}

func getTier(ctx context.Context, client MinioAdmin, params *admin_api.GetTierParams) (*models.Tier, error) {

	tiers, err := client.listTiers(ctx)
	if err != nil {
		return nil, err
	}
	for i := range tiers {
		switch tiers[i].Type {
		case madmin.S3:
			if params.Type != models.TierTypeS3 || tiers[i].S3.Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeS3,
				S3: &models.TierS3{
					Accesskey:    tiers[i].S3.AccessKey,
					Bucket:       tiers[i].S3.Bucket,
					Endpoint:     tiers[i].S3.Endpoint,
					Name:         tiers[i].S3.Name,
					Prefix:       tiers[i].S3.Prefix,
					Region:       tiers[i].S3.Region,
					Secretkey:    tiers[i].S3.SecretKey,
					Storageclass: tiers[i].S3.StorageClass,
				},
			}, err
		case madmin.GCS:
			if params.Type != models.TierTypeGcs || tiers[i].GCS.Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeGcs,
				Gcs: &models.TierGcs{
					Bucket:       tiers[i].GCS.Bucket,
					Creds:        tiers[i].GCS.Creds,
					Endpoint:     tiers[i].GCS.Endpoint,
					Name:         tiers[i].GCS.Name,
					Prefix:       tiers[i].GCS.Prefix,
					Region:       tiers[i].GCS.Region,
					Storageclass: tiers[i].GCS.StorageClass,
				},
			}, nil
		case madmin.Azure:
			if params.Type != models.TierTypeAzure || tiers[i].Azure.Name != params.Name {
				continue
			}
			return &models.Tier{
				Type: models.TierTypeAzure,
				Azure: &models.TierAzure{
					Accountkey:   tiers[i].Azure.AccountKey,
					Accountname:  tiers[i].Azure.AccountName,
					Bucket:       tiers[i].Azure.Bucket,
					Endpoint:     tiers[i].Azure.Endpoint,
					Name:         tiers[i].Azure.Name,
					Prefix:       tiers[i].Azure.Prefix,
					Region:       tiers[i].Azure.Region,
					Storageclass: tiers[i].Azure.StorageClass,
				},
			}, nil
		}
	}

	// build response
	return nil, ErrorGenericNotFound
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getGetTierResponse(session *models.Principal, params *admin_api.GetTierParams) (*models.Tier, *models.Error) {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return nil, prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	addTierResp, err := getTier(ctx, adminClient, params)
	if err != nil {
		log.Println("error here")
		return nil, prepareError(err)
	}
	return addTierResp, nil
}

func editTierCredentials(ctx context.Context, client MinioAdmin, params *admin_api.EditTierCredentialsParams) error {
	creds := madmin.TierCreds{
		AccessKey: params.Body.AccessKey,
		SecretKey: params.Body.SecretKey,
		CredsJSON: []byte(params.Body.Creds),
	}
	err := client.editTierCreds(ctx, params.Name, creds)
	if err != nil {
		return err
	}
	return nil
}

// getNotificationEndpointsResponse returns a list of notification endpoints in the instance
func getEditTierCredentialsResponse(session *models.Principal, params *admin_api.EditTierCredentialsParams) *models.Error {
	mAdmin, err := newMAdminClient(session)
	if err != nil {
		return prepareError(err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := adminClient{client: mAdmin}
	// 20 seconds timeout
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// serialize output
	err = editTierCredentials(ctx, adminClient, params)
	if err != nil {
		log.Println("error here")
		return prepareError(err)
	}
	return nil
}