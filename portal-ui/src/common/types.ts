// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

/* Copyright (c) 2020 MinIO, Inc. All rights reserved. */

export interface ITenantsObject {
  tenants: ITenant[];
}

export interface ITenant {
  creation_date: string;
  deletion_date: string;
  currentState: string;
  image: string;
  console_image: string;
  instance_count: string;
  name: string;
  namespace?: string;
  total_size: string;
  used_size: string;
  volume_count: string;
  volume_size: string;
  volumes_per_server?: string;
  zone_count: string;
  zones?: IZoneModel[];
  used_capacity?: string;
  endpoint?: string;
  storage_class?: string;
  enable_prometheus: boolean;
}

export interface IVolumeConfiguration {
  size: string;
  storage_class_name: string;
  // labels: any;
}

export interface ITenantCreator {
  name: string;
  service_name: string;
  enable_console: boolean;
  enable_prometheus: boolean;
  enable_tls: boolean;
  access_key: string;
  secret_key: string;
  image: string;
  console_image: string;
  zones: IZoneModel[];
  namespace: string;
  erasureCodingParity: number;
  tls?: ITLSTenantConfiguration;
  encryption?: IEncryptionConfiguration;
  idp?: IIDPConfiguration;
  annotations?: Object;
}

export interface ITenantUpdateObject {
  image: string;
  image_registry?: IRegistryObject;
}

export interface IRegistryObject {
  registry: string;
  username: string;
  password: string;
}

export interface ITenantUsage {
  used: string;
  disk_used: string;
}

export interface IAffinityModel {
  podAntiAffinity: IPodAntiAffinityModel;
}

export interface IPodAntiAffinityModel {
  requiredDuringSchedulingIgnoredDuringExecution: IPodAffinityTerm[];
}

export interface IPodAffinityTerm {
  labelSelector: IPodAffinityTermLabelSelector;
  topologyKey: string;
}

export interface IPodAffinityTermLabelSelector {
  matchExpressions: IMatchExpressionItem[];
}

export interface IMatchExpressionItem {
  key: string;
  operator: string;
  values: string[];
}

export interface ITolerationModel {
  effect: string;
  key: string;
  operator: string;
  value?: string;
  tolerationSeconds?: ITolerationSeconds;
}

export interface ITolerationSeconds {
  seconds: number;
}

export interface IResourceModel {
  requests: IResourceRequests;
  limits: IResourceLimits;
}

export interface IResourceRequests {
  memory: number;
}

export interface IResourceLimits {
  memory: number;
}

export interface ITLSTenantConfiguration {
  minio: ITLSConfiguration;
  console: ITLSConfiguration;
}

export interface ITLSConfiguration {
  crt: string;
  key: string;
}

export interface IEncryptionConfiguration {
  server: ITLSConfiguration;
  client: ITLSConfiguration;
  master_key?: string;
  gemalto?: IGemaltoConfig;
  aws?: IAWSConfig;
  vault?: IVaultConfig;
}

export interface IVaultConfig {
  endpoint: string;
  engine?: string;
  namespace?: string;
  prefix?: string;
  approle: IApproleConfig;
  tls: IVaultTLSConfig;
  status: IVaultStatusConfig;
}

export interface IGemaltoConfig {
  keysecure: IKeysecureConfig;
}

export interface IAWSConfig {
  secretsmanager: ISecretsManagerConfig;
}

export interface IApproleConfig {
  engine: string;
  id: string;
  secret: string;
  retry: number;
}

export interface IVaultTLSConfig {
  key: string;
  crt: string;
  ca: string;
}

export interface IVaultStatusConfig {
  ping: number;
}

export interface IKeysecureConfig {
  endpoint: string;
  credentials: IGemaltoCredentials;
  tls: IGemaltoTLS;
}

export interface IGemaltoCredentials {
  token: string;
  domain: string;
  retry?: number;
}

export interface IGemaltoTLS {
  ca: string;
}

export interface ISecretsManagerConfig {
  endpoint: string;
  region: string;
  kmskey?: string;
  credentials: IAWSCredentials;
}

export interface IAWSCredentials {
  accesskey: string;
  secretkey: string;
  token?: string;
}

export interface IIDPConfiguration {
  oidc?: IOpenIDConfiguration;
  active_directory: IActiveDirectoryConfiguration;
}

export interface IOpenIDConfiguration {
  url: string;
  client_id: string;
  secret_id: string;
}

export interface IActiveDirectoryConfiguration {
  url: string;
  skip_tls_verification: boolean;
  server_insecure: boolean;
  user_search_filter: string;
  group_Search_base_dn: string;
  group_search_filter: string;
  group_name_attribute: string;
}

export interface IStorageDistribution {
  error: number;
  nodes: number;
  persistentVolumes: number;
  disks: number;
  pvSize: number;
}

export interface IErasureCodeCalc {
  error: number;
  maxEC: string;
  erasureCodeSet: number;
  rawCapacity: string;
  storageFactors: IStorageFactors[];
  defaultEC: string;
}

export interface IStorageFactors {
  erasureCode: string;
  storageFactor: number;
  maxCapacity: string;
}

export interface ITenantHealthInList {
  name: string;
  namespace: string;
  status?: string;
  message?: string;
}

export interface ITenantsListHealthRequest {
  tenants: ITenantHealthInList[];
}

export interface IMaxAllocatableMemoryRequest {
  num_nodes: number;
}

export interface IMaxAllocatableMemoryResponse {
  max_memory: number;
}

export interface IEncryptionUpdateRequest {
  encryption: IEncryptionConfiguration;
}

export interface IArchivedTenantsList {
  tenants: IArchivedTenant[];
}

export interface IArchivedTenant {
  namespace: string;
  tenant: string;
  number_volumes: number;
  capacity: number;
}

export interface IZoneModel {
  name?: string;
  servers: number;
  volumes_per_server: number;
  volume_configuration: IVolumeConfiguration;
  affinity?: IAffinityModel;
  tolerations?: ITolerationModel[];
  resources?: IResourceModel;
}

export interface IUpdateZone {
  zones: IZoneModel[];
}
