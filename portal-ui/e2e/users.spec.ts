// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import { expect } from "@playwright/test";
import { test } from "./fixtures/baseFixture";

test.use({ storageState: "playwright/.auth/admin.json" });

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5005/");
});

test("create a new user", async ({ page }) => {
  const userName = `new-user-${Math.random() * 100}`;

  await page.getByRole("button", { name: "Identity Identity" }).click();
  await page.getByRole("link", { name: "Users Users" }).click();
  await page.getByRole("button", { name: "Create User" }).click();
  await page.getByLabel("User Name").click();
  await page.getByLabel("User Name").fill(userName);
  await page.getByLabel("User Name").press("Tab");
  await page.getByLabel("Password").fill("newuser123");
  await page
    .locator(
      "div:nth-child(4) > div > .MuiButtonBase-root > .PrivateSwitchBase-input"
    )
    .check();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("gridcell", { name: userName })).toBeTruthy();
});
