# j2e
## JSON to EXCEL and EXCEL to JSON CLI 

j2e is a cli tool for converting json files to excel files and excel files to json file. This tool is really helpful when you work with multi-lingual projects <br>
This package is released under the [MIT license](https://github.com/mshahulpm/LICENSE) .<br>


Install package
```shell
npm i -g j2e
```
<br>

#### Usage 
##### convert json to excel 

```shell
 j2e -j <path to json file or dir of json files> 
```
<br>

###### Examples 

1. single file
```shell
 j2e -j file.json 
```

You will get out.xlsx with single sheet 

2. a directory of json files
```shell
 j2e -j files
```

You will get out.xlsx with multiple sheets 