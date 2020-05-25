# Categorize elements in the Forge Viewer

Application that allows elements to be categorized and colored in the Forge Viewer based on user criteria.

It uses 4 of the [Forge APIs & Services](https://forge.autodesk.com/developer/documentation):
- Authentication
- Data Management (OSS)
- Model Derivative
- Viewer

## Description

Includes the following functionalities:
- Get all buckets of the application
- Get all objects in a bucket
- Create a new bucket
- Upload an object to a bucket and translate it for the Forge Viewer
- View an object in the Forge Viewer
- Categorize and color elements in the Forge Viewer based on user selection of an element property
- Categorize and color elements in the Forge Viewer based on a pre-defined XML-Schema with properties
- Delete a translation
- Delete an object
- Delete a bucket

## Prerequisites

- Node.js with NPM
- Autodesk Forge Application

## Installing

- Clone or download the files
- Open the **.env_sample** and type in your **Client ID** and **Client Secret**
- Save the file and rename it as **.env**
- With your Terminal/Command Prompt navigate to the folder where the **package.json** file is stored and type:

```
npm install
```

This should install all required packages.

## Running

- Run the program:

```
node start.js
```

- Open a web browser and navigate to **http://localhost:3000/**

### How to use

Here is a short video showing how to run it and use the different features:


[![Running and using the application](https://img.youtube.com/vi/abfSMBIMFJQ/0.jpg)](https://youtu.be/abfSMBIMFJQ)