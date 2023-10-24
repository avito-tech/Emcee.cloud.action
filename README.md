
# Emcee.cloud action

[![GitHub Super-Linter](https://github.com/JasperJhons/e-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![coverage](badges/coverage.svg)

This action implements basic API calls for [emcee.cloud](https://emcee.cloud/)

Full documentation available [here](https://emcee.cloud/docs/)

With this action you can do the following:

- Upload your test artifacts to [emcee.cloud](https://emcee.cloud/) (*optional*)
- Create new Test Run
- Wait until the end of Test Run (*optional*)
- Download Test report artifacts on Test Run completion
(*requires waiting until the end*)

## Inputs

> [!IMPORTANT]
> Important note about `iOS`
>
> All `iOS` artifacts must be packed in `zip`
>
> Any URL/Paths to any ZIP archive is expected to contain a reference to a file
> inside that archive.
>
>[Read more](https://github.com/avito-tech/Emcee/wiki/URL-Handling)

### `emcee_token`

**Required** [Token for emcee.cloud API](https://docs.emcee.cloud/cloud/profile/#api-tokens)

### `platform`

**Required** `iOS` or `Android`

### `device_os_version`

**Required** Device os version or Android API level.

### `app_path`

(*Optional*) URL or PATH to App under tests. Default: `empty`.

You can specify several values separated by commas. (ex. `url1,path1,url2`).

### `tests_path`

(*Optional*) URL or PATH to binary with tests. Default: `empty`.

You can specify several values separated by commas. (ex. `url1,path1,url2`)

### `runner_path`

(*Optional*) Default: `empty`.

For `iOS`: URL or PATH to test runner binary.
You can specify several values separated by commas. (ex. `url1,path1,url2`).

For `Android`: Test Runner class (default)

### `test_plan_path`

(*Optional*)(*iOS only*) URL or PATH to test XCTestRun file. Default: `empty`.

### `envs`

(*Optional*) Comma separated envs ex.`ENV1=value1,ENV2=value2`

### `wait_for_end`

(*Optional*) Blocking your flow and waiting for the tests to complete. Default: `true`

### `download_reports`

(*Optional*) Comma separated list of reports to be downloaded upon completion.
ex:`allure,junit` Works only with `wait_for_end:true`

## Outputs

### `run_id`

Test Run ID on [emcee.cloud](https://emcee.cloud/)

### `run_url`

Test Run URL on [emcee.cloud](https://emcee.cloud/)

### `reports_path`

The directory into which reports were saved

## Example usage

```yaml
        uses: ./
        with:
          emcee_token: ${{ secrets.EMCEE_TOKEN }}
          app_path: http://emcee.cloud/api/v1/file/download/123#app-debug.apk
          tests_path: ./556b821d-d1e4-4a0a-ba5b-3696862a9353#app-debug-androidTest.apk
          platform: android
          device_os_version: 27
          download_reports: allure
```
