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

import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import get from "lodash/get";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { BucketObject, RewindObject, RewindObjectList } from "./types";
import api from "../../../../../../common/api";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import { niceBytes } from "../../../../../../common/utils";
import DeleteObject from "./DeleteObject";

import {
  actionsTray,
  containerForHeader,
  objectBrowserCommon,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { Badge, Button, IconButton, Tooltip } from "@material-ui/core";
import * as reactMoment from "react-moment";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import {
  addRoute,
  fileDownloadStarted,
  fileIsBeingPrepared,
  resetRewind,
  setAllRoutes,
  setLastAsFile,
} from "../../../../ObjectBrowser/actions";
import {
  ObjectBrowserReducer,
  Route,
} from "../../../../ObjectBrowser/reducers";
import CreateFolderModal from "./CreateFolderModal";
import { download } from "../utils";
import {
  setErrorSnackMessage,
  setLoadingProgress,
  setSnackBarMessage,
} from "../../../../../../actions";
import { BucketVersioning } from "../../../types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import RewindEnable from "./RewindEnable";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteMultipleObjects from "./DeleteMultipleObjects";
import { baseUrl } from "../../../../../../history";
import ScreenTitle from "../../../../Common/ScreenTitle/ScreenTitle";
import AddFolderIcon from "../../../../../../icons/AddFolderIcon";
import HistoryIcon from "../../../../../../icons/HistoryIcon";
import ObjectBrowserIcon from "../../../../../../icons/ObjectBrowserIcon";
import ObjectBrowserFolderIcon from "../../../../../../icons/ObjectBrowserFolderIcon";
import FolderIcon from "../../../../../../icons/FolderIcon";
import RefreshIcon from "../../../../../../icons/RefreshIcon";
import SearchIcon from "../../../../../../icons/SearchIcon";
import UploadIcon from "../../../../../../icons/UploadIcon";

const commonIcon = {
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  width: 16,
  minWidth: 16,
  height: 40,
  marginRight: 10,
};

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },

    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    fileName: {
      display: "flex",
      alignItems: "center",
      "& .MuiSvgIcon-root": {
        marginRight: 4,
      },
    },
    fileNameText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    iconFolder: {
      backgroundImage: "url(/images/object-browser-folder-icn.svg)",
      backgroundSize: "auto",
      ...commonIcon,
    },
    iconFile: {
      backgroundImage: "url(/images/object-browser-icn.svg)",
      backgroundSize: "auto",
      ...commonIcon,
    },
    buttonsContainer: {
      "& .MuiButtonBase-root": {
        marginLeft: 10,
      },
    },
    browsePaper: {
      height: "calc(100vh - 280px)",
    },
    "@global": {
      ".rowLine:hover  .iconFileElm": {
        backgroundImage: "url(/images/ob_file_filled.svg)",
      },
      ".rowLine:hover  .iconFolderElm": {
        backgroundImage: "url(/images/ob_folder_filled.svg)",
      },
    },
    listButton: {
      marginLeft: "10px",
    },
    badgeOverlap: {
      "& .MuiBadge-badge": {
        top: 35,
        right: 10,
      },
    },
    ...actionsTray,
    ...searchField,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  });

interface IListObjectsProps {
  classes: any;
  match: any;
  loading: boolean;
  loadingRewind: boolean;
  setLoading: any;
  records: BucketObject[];
  rewind: BucketObject[];
  addRoute: (param1: string, param2: string, param3: string) => any;
  setAllRoutes: (path: string) => any;
  routesList: Route[];
  downloadingFiles: string[];
  setLastAsFile: () => any;
  rewindEnabled: boolean;
  rewindDate: any;
  bucketToRewind: string;
  setLoadingProgress: typeof setLoadingProgress;
  setSnackBarMessage: typeof setSnackBarMessage;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  fileIsBeingPrepared: typeof fileIsBeingPrepared;
  fileDownloadStarted: typeof fileDownloadStarted;
  resetRewind: typeof resetRewind;
  internalPaths: string;
  bucketName: string;
  isVersioned: boolean;
}

const ListObjects = ({
  classes,
  match,
  loading,
  loadingRewind,
  setLoading,
  records,
  rewind,
  addRoute,
  setAllRoutes,
  routesList,
  downloadingFiles,
  rewindEnabled,
  rewindDate,
  bucketToRewind,
  setLastAsFile,
  setLoadingProgress,
  setSnackBarMessage,
  setErrorSnackMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
  resetRewind,
  internalPaths,
  bucketName,
  isVersioned,
}: IListObjectsProps) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [selectedObject, setSelectedObject] = useState<string>("");
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterObjects, setFilterObjects] = useState<string>("");
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);

  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

  const fileUpload = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const url = get(match, "url", `/buckets/${bucketName}/browse`);
  //   if (url !== routesList[routesList.length - 1].route) {
  //     setAllRoutes(url);
  //   }
  // }, [match, routesList, setAllRoutes]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      setSnackBarMessage(`Object '${selectedObject}' deleted successfully.`);
      setLoading(true);
    }
  };

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      setSnackBarMessage(`Objects deleted successfully.`);
      setSelectedObjects([]);
      setLoading(true);
    }
  };

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const upload = (e: any, bucketName: string, path: string) => {
    if (
      e === null ||
      e === undefined ||
      e.target === null ||
      e.target === undefined
    ) {
      return;
    }
    e.preventDefault();
    let files = e.target.files;
    let uploadUrl = `${baseUrl}/api/v1/buckets/${bucketName}/objects/upload`;
    if (path !== "") {
      const encodedPath = encodeURIComponent(path);
      uploadUrl = `${uploadUrl}?prefix=${encodedPath}`;
    }
    let xhr = new XMLHttpRequest();
    const areMultipleFiles = files.length > 1 ? true : false;
    const errorMessage = `An error occurred while uploading the file${
      areMultipleFiles ? "s" : ""
    }.`;
    const okMessage = `Object${
      areMultipleFiles ? "s" : ``
    } uploaded successfully.`;

    xhr.open("POST", uploadUrl, true);

    xhr.withCredentials = false;
    xhr.onload = function (event) {
      if (
        xhr.status === 401 ||
        xhr.status === 403 ||
        xhr.status === 400 ||
        xhr.status === 500
      ) {
        setSnackBarMessage(errorMessage);
      }
      if (xhr.status === 200) {
        setSnackBarMessage(okMessage);
      }
    };

    xhr.upload.addEventListener("error", (event) => {
      setSnackBarMessage(errorMessage);
    });

    xhr.upload.addEventListener("progress", (event) => {
      setLoadingProgress(Math.floor((event.loaded * 100) / event.total));
    });

    xhr.onerror = () => {
      setSnackBarMessage(errorMessage);
    };
    xhr.onloadend = () => {
      setLoading(true);
      setLoadingProgress(100);
    };

    const formData = new FormData();

    for (let file of files) {
      const fileName = file.name;
      const blobFile = new Blob([file]);
      formData.append(fileName, blobFile);
    }

    xhr.send(formData);
    e.target.value = null;
  };

  const displayParsedDate = (object: BucketObject) => {
    if (object.name.endsWith("/")) {
      return "";
    }
    return <reactMoment.default>{object.last_modified}</reactMoment.default>;
  };

  const displayNiceBytes = (object: BucketObject) => {
    if (object.name.endsWith("/")) {
      return "";
    }
    return niceBytes(String(object.size));
  };

  const confirmDeleteObject = (object: string) => {
    setDeleteOpen(true);
    setSelectedObject(object);
  };

  const removeDownloadAnimation = (path: string) => {
    fileDownloadStarted(path);
  };

  const displayDeleteFlag = (state: boolean) => {
    return state ? "Yes" : "No";
  };

  const downloadObject = (object: BucketObject) => {
    if (object.size > 104857600) {
      // If file is bigger than 100MB we show a notification
      setSnackBarMessage(
        "Download process started, it may take a few moments to complete"
      );
    }

    download(
      selectedBucket,
      object.name,
      object.version_id,
      removeDownloadAnimation
    );
  };

  const openPath = (idElement: string) => {
    const currentPath = get(match, "url", `/buckets/${bucketName}/browse`);

    // Element is a folder, we redirect to it
    if (idElement.endsWith("/")) {
      const idElementClean = idElement
        .substr(0, idElement.length - 1)
        .split("/");
      const lastIndex = idElementClean.length - 1;
      const newPath = `${currentPath}/${idElementClean[lastIndex]}`;

      addRoute(newPath, idElementClean[lastIndex], "path");
      return;
    }
    // Element is a file. we open details here
    const pathInArray = idElement.split("/");
    const fileName = pathInArray[pathInArray.length - 1];
    const newPath = `${currentPath}/${fileName}`;

    addRoute(newPath, fileName, "file");
    return;
  };

  const uploadObject = (e: any): void => {
    // Handle of deeper routes.
    const currentPath = routesList[routesList.length - 1].route;
    const splitPaths = currentPath
      .split("/")
      .filter((item) => item.trim() !== "");

    let path = "";

    if (splitPaths.length > 2) {
      path = `${splitPaths.slice(2).join("/")}/`;
    }

    upload(e, selectedBucket, path);
  };

  const tableActions = [
    { type: "view", onClick: openPath, sendOnlyId: true },
    {
      type: "download",
      onClick: downloadObject,
      showLoaderFunction: (item: string) =>
        downloadingFiles.includes(`${match.params["bucket"]}/${item}`),
      disableButtonFunction: (item: string) => {
        if (rewindEnabled) {
          const element = rewind.find((elm) => elm.name === item);

          if (element && element.delete_flag) {
            return true;
          }
        }
        return false;
      },
      sendOnlyId: false,
    },
    {
      type: "delete",
      onClick: confirmDeleteObject,
      sendOnlyId: true,
      disableButtonFunction: () => {
        return rewindEnabled;
      },
    },
  ];

  const displayName = (element: string) => {
    let elementString = element;
    let icon = <ObjectBrowserIcon width={16} />;
    // Element is a folder
    if (element.endsWith("/")) {
      icon = <ObjectBrowserFolderIcon width={16} />;
      elementString = element.substr(0, element.length - 1);
    }

    const splitItem = elementString.split("/");

    return (
      <div className={classes.fileName}>
        {icon}
        <span className={classes.fileNameText}>
          {splitItem[splitItem.length - 1]}
        </span>
      </div>
    );
  };

  const filteredRecords = records.filter((b: BucketObject) => {
    if (filterObjects === "") {
      return true;
    } else {
      if (b.name.indexOf(filterObjects) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  const rewindCloseModal = (refresh: boolean) => {
    setRewindSelect(false);

    if (refresh) {
    }
  };

  const selectListObjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedObjects]; // We clone the selectedBuckets array

    if (checked) {
      // If the user has checked this field we need to push this to selectedBucketsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedObjects(elements);

    return elements;
  };

  const listModeColumns = [
    {
      label: "Name",
      elementKey: "name",
      renderFunction: displayName,
    },
    {
      label: "Last Modified",
      elementKey: "last_modified",
      renderFunction: displayParsedDate,
      renderFullObject: true,
    },
    {
      label: "Size",
      elementKey: "size",
      renderFunction: displayNiceBytes,
      renderFullObject: true,
      width: 60,
      contentTextAlign: "right",
    },
  ];

  const rewindModeColumns = [
    {
      label: "Name",
      elementKey: "name",
      renderFunction: displayName,
    },
    {
      label: "Object Date",
      elementKey: "last_modified",
      renderFunction: displayParsedDate,
      renderFullObject: true,
    },
    {
      label: "Size",
      elementKey: "size",
      renderFunction: displayNiceBytes,
      renderFullObject: true,
      width: 60,
      contentTextAlign: "right",
    },
    {
      label: "Deleted",
      elementKey: "delete_flag",
      renderFunction: displayDeleteFlag,
      width: 60,
      contentTextAlign: "center",
    },
  ];

  let pageTitle = "Folder";

  if (match) {
    if ("bucket" in match.params) {
      pageTitle = match.params["bucket"];
    }
    if ("0" in match.params) {
      pageTitle = match.params["0"].split("/").pop();
    }
  }

  return (
    <React.Fragment>
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={selectedBucket}
          selectedObject={selectedObject}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={selectedBucket}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
        />
      )}
      {createFolderOpen && (
        <CreateFolderModal
          modalOpen={createFolderOpen}
          folderName={routesList[routesList.length - 1].route}
          onClose={closeAddFolderModal}
        />
      )}
      {rewindSelect && (
        <RewindEnable
          open={rewindSelect}
          closeModalAndRefresh={rewindCloseModal}
          bucketName={bucketName}
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <FolderIcon width={40} />
              </Fragment>
            }
            title={pageTitle}
            subTitle={
              <Fragment>
                <BrowserBreadcrumbs
                  bucketName={bucketName}
                  internalPaths={internalPaths}
                />
              </Fragment>
            }
            actions={
              <Fragment>
                <Tooltip title={"Choose or create a new path"}>
                  <IconButton
                    color="primary"
                    aria-label="Add a new folder"
                    component="span"
                    onClick={() => {
                      setCreateFolderOpen(true);
                    }}
                    disabled={rewindEnabled}
                  >
                    <AddFolderIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={"Upload file"}>
                  <IconButton
                    color="primary"
                    aria-label="Refresh List"
                    component="span"
                    onClick={() => {
                      if (fileUpload && fileUpload.current) {
                        fileUpload.current.click();
                      }
                    }}
                    disabled={rewindEnabled}
                  >
                    <UploadIcon />
                  </IconButton>
                </Tooltip>

                <input
                  type="file"
                  multiple={true}
                  onChange={(e) => uploadObject(e)}
                  id="file-input"
                  style={{ display: "none" }}
                  ref={fileUpload}
                />
                <Tooltip title={"Rewind"}>
                  <Badge
                    badgeContent=" "
                    color="secondary"
                    variant="dot"
                    invisible={!rewindEnabled}
                    className={classes.badgeOverlap}
                  >
                    <IconButton
                      color="primary"
                      aria-label="Rewind"
                      component="span"
                      onClick={() => {
                        setRewindSelect(true);
                      }}
                      disabled={!isVersioned}
                    >
                      <HistoryIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <Tooltip title={"Refresh list"}>
                  <IconButton
                    color="primary"
                    aria-label="Refresh List"
                    component="span"
                    onClick={() => {
                      setLoading(true);
                    }}
                    disabled={rewindEnabled}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Search Objects"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(val) => {
              setFilterObjects(val.target.value);
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon width={18} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={() => {
              setDeleteMultipleOpen(true);
            }}
            disabled={selectedObjects.length === 0}
          >
            Delete Selected
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            itemActions={tableActions}
            columns={rewindEnabled ? rewindModeColumns : listModeColumns}
            isLoading={rewindEnabled ? loadingRewind : loading}
            // TODO/ READD
            // loadingMessage={loadingMessage}
            entityName="Rewind Objects"
            idField="name"
            records={rewindEnabled ? rewind : filteredRecords}
            customPaperHeight={classes.browsePaper}
            selectedItems={selectedObjects}
            onSelect={selectListObjects}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  routesList: get(objectBrowser, "routesList", []),
  downloadingFiles: get(objectBrowser, "downloadingFiles", []),
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
});

const mapDispatchToProps = {
  addRoute,
  setAllRoutes,
  setLastAsFile,
  setLoadingProgress,
  setSnackBarMessage,
  setErrorSnackMessage,
  fileIsBeingPrepared,
  fileDownloadStarted,
  resetRewind,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(withStyles(styles)(ListObjects)));
