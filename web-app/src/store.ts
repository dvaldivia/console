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

import { useDispatch } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import systemReducer from "./systemSlice";
import loginReducer from "./screens/LoginPage/loginSlice";
import consoleReducer from "./screens/Console/consoleSlice";
import addBucketsReducer from "./screens/Console/Buckets/ListBuckets/AddBucket/addBucketsSlice";
import bucketDetailsReducer from "./screens/Console/Buckets/BucketDetails/bucketDetailsSlice";
import objectBrowserReducer from "./screens/Console/ObjectBrowser/objectBrowserSlice";
import licenseReducer from "./screens/Console/License/licenseSlice";
import { objectBrowserWSMiddleware } from "./websockets/objectBrowserWSMiddleware";

var objectsWS: WebSocket;

const rootReducer = combineReducers({
  system: systemReducer,
  login: loginReducer,
  console: consoleReducer,
  addBucket: addBucketsReducer,
  bucketDetails: bucketDetailsReducer,
  objectBrowser: objectBrowserReducer,
  license: licenseReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(objectBrowserWSMiddleware(objectsWS)),
});

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(rootReducer);
  });
}

export type AppState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
