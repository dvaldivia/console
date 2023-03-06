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

test("create a new bucket", async ({ page }) => {
  await page.getByRole("link", { name: "Buckets Buckets" }).click();
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.getByLabel("Bucket Name*").click();

  const bucketName = `new-bucket-${Math.random() * 100}`;

  await page.getByLabel("Bucket Name*").fill(bucketName);
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await expect(page.locator(`#manageBucket-${bucketName}`)).toBeTruthy();
});
