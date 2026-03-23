# CameraPlugin - Cordova

*This plugin is SUPPORTED by OutSystems. Customers entitled to Support Services may obtain assistance through Support.*

This plugin is only available in Native Android and iOS; not available for Web / PWAs.

## Installation

```console
cordova plugin add <path-to-repo-local-clone>
```

## API

<docgen-index>

* [`takePhoto(...)`](#takephoto)
* [`chooseFromGallery(...)`](#choosefromgallery)
* [`pickLimitedGallery(...)`](#picklimitedgallery)
* [`chooseFromLimitedGallery(...)`](#choosefromlimitedgallery)
* [`editURIPhoto(...)`](#edituriphoto)
* [`editPhoto(...)`](#editphoto)
* [`recordVideo(...)`](#recordvideo)
* [`playVideo(...)`](#playvideo)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Only available in Native Android and iOS; not available for Web / PWAs.

### takePhoto(...)

```typescript
takePhoto(options: TakePhotoOptions) => Promise<MediaResult>
```

Captures a photo using the device's camera.

| Param         | Type                                                          | Description                                     |
| ------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| **`options`** | <code><a href="#takephotooptions">TakePhotoOptions</a></code> | Options to customize the photo capture process. |

**Returns:** <code>Promise&lt;<a href="#mediaresult">MediaResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### chooseFromGallery(...)

```typescript
chooseFromGallery(options: GalleryOptions) => Promise<MediaResult[]>
```

Opens the device's photo gallery to allow the user to select one or more photos.

| Param         | Type                                                      | Description                                         |
| ------------- | --------------------------------------------------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#galleryoptions">GalleryOptions</a></code> | Options to customize the gallery selection process. |

**Returns:** <code>Promise&lt;MediaResult[]&gt;</code>

**Since:** 1.0.0

--------------------


### pickLimitedGallery(...)

```typescript
pickLimitedGallery(options: GalleryOptions) => Promise<MediaResult[]>
```

Opens the device's limited photo gallery to allow the user to select one or more photos.

| Param         | Type                                                      | Description                                                 |
| ------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#galleryoptions">GalleryOptions</a></code> | Options to customize the limited gallery selection process. |

**Returns:** <code>Promise&lt;MediaResult[]&gt;</code>

**Since:** 1.0.0

--------------------


### chooseFromLimitedGallery(...)

```typescript
chooseFromLimitedGallery(options: GalleryOptions) => Promise<MediaResult[]>
```

Opens the device's limited photo gallery to allow the user to select one or more photos.

| Param         | Type                                                      | Description                                                 |
| ------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| **`options`** | <code><a href="#galleryoptions">GalleryOptions</a></code> | Options to customize the limited gallery selection process. |

**Returns:** <code>Promise&lt;MediaResult[]&gt;</code>

**Since:** 1.0.0

--------------------


### editURIPhoto(...)

```typescript
editURIPhoto(options: EditURIPhotoOptions) => Promise<MediaResult>
```

Opens the photo editor to allow the user to edit a photo.

| Param         | Type                                                                | Description                                     |
| ------------- | ------------------------------------------------------------------- | ----------------------------------------------- |
| **`options`** | <code><a href="#edituriphotooptions">EditURIPhotoOptions</a></code> | Options to customize the photo editing process. |

**Returns:** <code>Promise&lt;<a href="#mediaresult">MediaResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### editPhoto(...)

```typescript
editPhoto(options: EditPhotoOptions) => Promise<EditPhotoResult>
```

Opens the photo editor to allow the user to edit a photo.

| Param         | Type                                                          | Description                 |
| ------------- | ------------------------------------------------------------- | --------------------------- |
| **`options`** | <code><a href="#editphotooptions">EditPhotoOptions</a></code> | Contains the photo to edit. |

**Returns:** <code>Promise&lt;<a href="#editphotoresult">EditPhotoResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### recordVideo(...)

```typescript
recordVideo(options: RecordVideoOptions) => Promise<MediaResult>
```

Records a video using the device's camera.

| Param         | Type                                                              | Description                                       |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#recordvideooptions">RecordVideoOptions</a></code> | Options to customize the video recording process. |

**Returns:** <code>Promise&lt;<a href="#mediaresult">MediaResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### playVideo(...)

```typescript
playVideo(options: PlayVideoOptions) => Promise<void>
```

Open a native video player.

| Param         | Type                                                          | Description                   |
| ------------- | ------------------------------------------------------------- | ----------------------------- |
| **`options`** | <code><a href="#playvideooptions">PlayVideoOptions</a></code> | Options for playing the video |

**Since:** 1.0.0

--------------------


### Interfaces


#### MediaResult

| Prop            | Type                                                    | Description                                                                                                                                                                                                                          | Since |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| **`type`**      | <code>'photo' \| 'video'</code>                         | The type of media captured or selected: 'photo' or 'video'.                                                                                                                                                                          | 1.0.0 |
| **`uri`**       | <code>string</code>                                     | The URI of the captured or selected media file. This is a string that represents the location of the media file on the device, which can be used to access or display the media content.                                             | 1.0.0 |
| **`thumbnail`** | <code>string</code>                                     | A base64-encoded thumbnail image representing the media, if available. For photos, this may be a smaller version of the captured image. For videos, this may be a thumbnail generated from the video content.                        | 1.0.0 |
| **`metadata`**  | <code><a href="#mediametadata">MediaMetadata</a></code> | Metadata about the captured or selected media, including file size, format, resolution, and creation date.                                                                                                                           | 1.0.0 |
| **`saved`**     | <code>boolean</code>                                    | Whether the media was saved to the photo album on the device (if applicable). This will be true if the media was saved to the photo album, and false if it was not saved (e.g., if it is only stored in a temporary cache location). | 1.0.0 |


#### MediaMetadata

| Prop               | Type                                              | Description                                                                                                                                                                                          | Since |
| ------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`size`**         | <code>number</code>                               | The size of the media file in bytes. This indicates how large the file is on disk, which can be useful for managing storage or determining if the file meets certain size requirements.              | 1.0.0 |
| **`duration`**     | <code>number</code>                               | The duration of the video in milliseconds. This is only applicable for video media.                                                                                                                  | 1.0.0 |
| **`format`**       | <code>string</code>                               | The format of the media file, e.g., 'jpeg' for images or 'mp4' for videos.                                                                                                                           | 1.0.0 |
| **`resolution`**   | <code><a href="#resolution">Resolution</a></code> | The resolution of the media file, represented as an object containing the width and height in pixels. This is applicable for both photos and videos, indicating the dimensions of the media content. | 1.0.0 |
| **`creationDate`** | <code><a href="#date">Date</a></code>             | The date and time when the media file was created.                                                                                                                                                   | 1.0.0 |


#### Resolution

| Prop         | Type                | Description                             | Since |
| ------------ | ------------------- | --------------------------------------- | ----- |
| **`width`**  | <code>number</code> | The width of the media file in pixels.  | 1.0.0 |
| **`height`** | <code>number</code> | The height of the media file in pixels. | 1.0.0 |


#### Date

Enables basic storage and retrieval of dates and times.

| Method                 | Signature                                                                                                    | Description                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **toString**           | () =&gt; string                                                                                              | Returns a string representation of a date. The format of the string depends on the locale.                                              |
| **toDateString**       | () =&gt; string                                                                                              | Returns a date as a string value.                                                                                                       |
| **toTimeString**       | () =&gt; string                                                                                              | Returns a time as a string value.                                                                                                       |
| **toLocaleString**     | () =&gt; string                                                                                              | Returns a value as a string value appropriate to the host environment's current locale.                                                 |
| **toLocaleDateString** | () =&gt; string                                                                                              | Returns a date as a string value appropriate to the host environment's current locale.                                                  |
| **toLocaleTimeString** | () =&gt; string                                                                                              | Returns a time as a string value appropriate to the host environment's current locale.                                                  |
| **valueOf**            | () =&gt; number                                                                                              | Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.                                                      |
| **getTime**            | () =&gt; number                                                                                              | Gets the time value in milliseconds.                                                                                                    |
| **getFullYear**        | () =&gt; number                                                                                              | Gets the year, using local time.                                                                                                        |
| **getUTCFullYear**     | () =&gt; number                                                                                              | Gets the year using Universal Coordinated Time (UTC).                                                                                   |
| **getMonth**           | () =&gt; number                                                                                              | Gets the month, using local time.                                                                                                       |
| **getUTCMonth**        | () =&gt; number                                                                                              | Gets the month of a <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                             |
| **getDate**            | () =&gt; number                                                                                              | Gets the day-of-the-month, using local time.                                                                                            |
| **getUTCDate**         | () =&gt; number                                                                                              | Gets the day-of-the-month, using Universal Coordinated Time (UTC).                                                                      |
| **getDay**             | () =&gt; number                                                                                              | Gets the day of the week, using local time.                                                                                             |
| **getUTCDay**          | () =&gt; number                                                                                              | Gets the day of the week using Universal Coordinated Time (UTC).                                                                        |
| **getHours**           | () =&gt; number                                                                                              | Gets the hours in a date, using local time.                                                                                             |
| **getUTCHours**        | () =&gt; number                                                                                              | Gets the hours value in a <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                       |
| **getMinutes**         | () =&gt; number                                                                                              | Gets the minutes of a <a href="#date">Date</a> object, using local time.                                                                |
| **getUTCMinutes**      | () =&gt; number                                                                                              | Gets the minutes of a <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                           |
| **getSeconds**         | () =&gt; number                                                                                              | Gets the seconds of a <a href="#date">Date</a> object, using local time.                                                                |
| **getUTCSeconds**      | () =&gt; number                                                                                              | Gets the seconds of a <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                           |
| **getMilliseconds**    | () =&gt; number                                                                                              | Gets the milliseconds of a <a href="#date">Date</a>, using local time.                                                                  |
| **getUTCMilliseconds** | () =&gt; number                                                                                              | Gets the milliseconds of a <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                      |
| **getTimezoneOffset**  | () =&gt; number                                                                                              | Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC).                             |
| **setTime**            | (time: number) =&gt; number                                                                                  | Sets the date and time value in the <a href="#date">Date</a> object.                                                                    |
| **setMilliseconds**    | (ms: number) =&gt; number                                                                                    | Sets the milliseconds value in the <a href="#date">Date</a> object using local time.                                                    |
| **setUTCMilliseconds** | (ms: number) =&gt; number                                                                                    | Sets the milliseconds value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                              |
| **setSeconds**         | (sec: number, ms?: number \| undefined) =&gt; number                                                         | Sets the seconds value in the <a href="#date">Date</a> object using local time.                                                         |
| **setUTCSeconds**      | (sec: number, ms?: number \| undefined) =&gt; number                                                         | Sets the seconds value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                   |
| **setMinutes**         | (min: number, sec?: number \| undefined, ms?: number \| undefined) =&gt; number                              | Sets the minutes value in the <a href="#date">Date</a> object using local time.                                                         |
| **setUTCMinutes**      | (min: number, sec?: number \| undefined, ms?: number \| undefined) =&gt; number                              | Sets the minutes value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                   |
| **setHours**           | (hours: number, min?: number \| undefined, sec?: number \| undefined, ms?: number \| undefined) =&gt; number | Sets the hour value in the <a href="#date">Date</a> object using local time.                                                            |
| **setUTCHours**        | (hours: number, min?: number \| undefined, sec?: number \| undefined, ms?: number \| undefined) =&gt; number | Sets the hours value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                     |
| **setDate**            | (date: number) =&gt; number                                                                                  | Sets the numeric day-of-the-month value of the <a href="#date">Date</a> object using local time.                                        |
| **setUTCDate**         | (date: number) =&gt; number                                                                                  | Sets the numeric day of the month in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                        |
| **setMonth**           | (month: number, date?: number \| undefined) =&gt; number                                                     | Sets the month value in the <a href="#date">Date</a> object using local time.                                                           |
| **setUTCMonth**        | (month: number, date?: number \| undefined) =&gt; number                                                     | Sets the month value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                     |
| **setFullYear**        | (year: number, month?: number \| undefined, date?: number \| undefined) =&gt; number                         | Sets the year of the <a href="#date">Date</a> object using local time.                                                                  |
| **setUTCFullYear**     | (year: number, month?: number \| undefined, date?: number \| undefined) =&gt; number                         | Sets the year value in the <a href="#date">Date</a> object using Universal Coordinated Time (UTC).                                      |
| **toUTCString**        | () =&gt; string                                                                                              | Returns a date converted to a string using Universal Coordinated Time (UTC).                                                            |
| **toISOString**        | () =&gt; string                                                                                              | Returns a date as a string value in ISO format.                                                                                         |
| **toJSON**             | (key?: any) =&gt; string                                                                                     | Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization. |


#### TakePhotoOptions

| Prop                     | Type                                                  | Description                                                                                                                                              | Default                        | Since |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----- |
| **`quality`**            | <code>number</code>                                   | The quality of image to return as JPEG, from 0-100. Default is 50. Not applicable for <a href="#encodingtype">EncodingType.PNG</a>.                      | <code>50</code>                | 1.0.0 |
| **`allowEdit`**          | <code>boolean</code>                                  | Whether to allow the user to crop or make small edits (platform specific).                                                                               |                                | 1.0.0 |
| **`encodingType`**       | <code><a href="#encodingtype">EncodingType</a></code> | The encoding type for the captured photo - JPEG or PNG.                                                                                                  | <code>EncodingType.JPEG</code> | 1.0.0 |
| **`targetWidth`**        | <code>number</code>                                   | The width to scale the image to, in pixels. Must be used with targetHeight. Aspect ratio remains constant.                                               |                                | 1.0.0 |
| **`targetHeight`**       | <code>number</code>                                   | The height to scale the image to, in pixels. Must be used with targetWidth. Aspect ratio remains constant.                                               |                                | 1.0.0 |
| **`cameraDirection`**    | <code>'FRONT' \| 'REAR'</code>                        | The camera to use (front- or back-facing). Default is 'REAR'.                                                                                            | <code>'REAR'</code>            | 1.0.0 |
| **`correctOrientation`** | <code>boolean</code>                                  | Whether to rotate the image to correct for the orientation of the device during capture. Default is false.                                               | <code>false</code>             | 1.0.0 |
| **`saveToGallery`**      | <code>boolean</code>                                  | Whether to save the image to the gallery on the device after capture. Default is false.                                                                  | <code>false</code>             | 1.0.0 |
| **`includeMetadata`**    | <code>boolean</code>                                  | Whether or not <a href="#mediaresult">MediaResult</a> should include its metadata. If an error occurs when obtaining the metadata, it will return empty. | <code>false</code>             | 1.0.0 |


#### GalleryOptions

| Prop                         | Type                                     | Description                                                                                                                                                                                                                                                                                                       | Default                    | Since |
| ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----- |
| **`mediaType`**              | <code>'photo' \| 'video' \| 'all'</code> | The type of media to select from the gallery: 'photo', 'video', or 'all'.                                                                                                                                                                                                                                         |                            | 1.0.0 |
| **`allowMultipleSelection`** | <code>boolean</code>                     | Whether to allow the user to select multiple media files from the gallery. Default is false (only single selection allowed).                                                                                                                                                                                      | <code>false</code>         | 1.0.0 |
| **`limit`**                  | <code>number</code>                      | Maximum number of photos the user will be able to choose. Note: This option is only supported on Android 13+ and iOS.                                                                                                                                                                                             | <code>0 (unlimited)</code> | 1.2.0 |
| **`includeMetadata`**        | <code>boolean</code>                     | Whether to include metadata in the <a href="#mediaresult">MediaResult</a> object for each selected media file. Default is true. If false, the metadata property in <a href="#mediaresult">MediaResult</a> will be null or undefined, and only the result (file URI, base64 string, or data URI) will be returned. | <code>true</code>          | 1.0.0 |
| **`allowEdit`**              | <code>boolean</code>                     | Whether to allow the user to crop or make small edits (platform specific).                                                                                                                                                                                                                                        |                            | 1.0.0 |


#### EditURIPhotoOptions

| Prop                  | Type                 | Description                                                                                                                                                       | Default            | Since |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----- |
| **`uri`**             | <code>string</code>  | The URI of the photo to edit. This is a string that represents the location of the photo on the device, which can be used to access or display the photo content. |                    | 1.0.0 |
| **`saveToGallery`**   | <code>boolean</code> | Whether to save the edited photo to the gallery. Default is false.                                                                                                | <code>false</code> | 1.0.0 |
| **`includeMetadata`** | <code>boolean</code> | Whether to include metadata in the <a href="#mediaresult">MediaResult</a>. Default is true.                                                                       | <code>true</code>  | 1.0.0 |


#### EditPhotoResult

| Prop              | Type                | Description                       | Since |
| ----------------- | ------------------- | --------------------------------- | ----- |
| **`outputImage`** | <code>string</code> | The edited image, base64 encoded. | 8.1.0 |


#### EditPhotoOptions

| Prop             | Type                | Description                       | Since |
| ---------------- | ------------------- | --------------------------------- | ----- |
| **`inputImage`** | <code>string</code> | The base64 encoded image to edit. | 8.1.0 |


#### RecordVideoOptions

| Prop                  | Type                 | Description                                                                                              | Default            | Since |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------------------- | ------------------ | ----- |
| **`saveToGallery`**   | <code>boolean</code> | Whether to save the recorded video to the gallery. Default is false.                                     | <code>false</code> | 1.0.0 |
| **`includeMetadata`** | <code>boolean</code> | Whether to include metadata in the <a href="#mediaresult">MediaResult</a>. Default is true.              | <code>true</code>  | 1.0.0 |
| **`isPersistent`**    | <code>boolean</code> | Whether to save the recorded the video persistently (even if not saved in the gallery). Default is true. | <code>true</code>  | 1.0.0 |


#### PlayVideoOptions

| Prop      | Type                | Description                                                                                             | Since |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------- | ----- |
| **`url`** | <code>string</code> | The URL of the video to play. This is a string that represents the location of the video on the device. | 1.0.0 |


### Enums


#### EncodingType

| Members    | Value          |
| ---------- | -------------- |
| **`JPEG`** | <code>0</code> |
| **`PNG`**  | <code>1</code> |

</docgen-api>
