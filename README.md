
# Emcee.cloud action

[![GitHub Super-Linter](https://github.com/JasperJhons/e-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![coverage](badges/coverage.svg)

This action encapsulates [Command-Line interface for Emcee.cloud](https://github.com/avito-tech/Emcee.cloud-CLI)

The main features in a nutshell:

- Running iOS/Android native tests
- Tracking test results during a run
- Downloading results
- Configuration via file and cli params

Full documentation available [here](https://docs.emcee.cloud/cloud/api/#command-line-interface).

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

**Required** `ios` or `android`

### `cloud_url`

(*Optional*) Emcee.cloud URL (default "https://emcee.cloud")

### `config_path`

(*Optional*) Path to emcee.cloud config file

### `app_path`

(*Optional*) App binary (Path/URL) which you want to test

### `envs`

(*Optional*) Comma separated envs ex.ENV1=value1,ENV2=value2

### `device_os_version`

(*Optional*) Device OS version (API level for Android). ex --os_version 34 --os_version iOS-17-0

### `output_folder`

(*Optional*) Output folder for test run results. Default: current folder

### `reports`

(*Optional*) Comma separated list of reports to be downloaded upon completion. ex:allure,junit

### `runner`

(*Optional*) '[iOS] Path/URL to your test runner. [Android. Optional] Class name of your test runner'

### `tests_app_path`
(*Optional*) Binary (Path/URL) with tests

### `wait_for_finish`
(*Optional*) 'Waiting for the tests to complete. Default: true'

## Outputs

### `reports_path`

The directory into which reports were saved

## Example usage

```yaml
        uses: avito-tech/Emcee.cloud.action@v0.0.2
        with:
          emcee_token: ${{ secrets.EMCEE_TOKEN }}
          app_path: https://emcee.cloud/api/v1/file/download/0786d961-93cb-4dc7-a9d5-443bd8922788#cloud_sample-debug.apk
          tests_app_path: https://emcee.cloud/api/v1/file/download/944a149a-b197-45b6-9f08-bd60afcfa94e#cloud_sample-debug-androidTest.apk
          platform: android
          device_os_version: 27
          reports: allure
```
