var fileType = 'ifc';
var selectionMode = 'one';
var propertySet = 'all'

var color = new THREE.Vector4(1, 0, 0, 0.8);
var propertyPanel;
var colorPanel;
var resultPanel;
var xml_file;

var viewer;
var options = {
    env: 'AutodeskProduction',
    api: 'derivativeV2_EU',
    getAccessToken: getForgeToken
};

var documentId = 'urn:' + getUrlParameter('urn');

var config = {
    extensions: ['OnClickProperties', 'CategorizeElementsExtension', 'ChangeSelectionExtension']
};

Autodesk.Viewing.Initializer(options, function onInitialized(){
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
});

function onDocumentLoadSuccess(doc) {

    var geometries = doc.getRoot().search({'type':'geometry'});
    if (geometries.length === 0) {
        console.error('Document contains no geometries.');
        return;
    }

    // Choose any of the avialable geometries
    var initGeom = geometries[0];

    // Create Viewer instance
    var viewerDiv = document.getElementById('viewer');
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);

    // Load the chosen geometry
    var svfUrl = doc.getViewablePath(initGeom);
    var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath()
    };

    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError); 
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onLoadModelSuccess(model) {
    console.log('onLoadModelSuccess()!');

    // Parent will be selected - works only for ifc!
    viewer.getProperties(1, function (props){
        if(props.name.includes('ifc')){
            viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.FIRST_OBJECT);
            selectionMode = 'all';
        }else{
            fileType = 'rvt';
        }
    });

    //Initializing Property Panel
    if (propertyPanel == null) {
        propertyPanel = new Autodesk.Viewing.UI.PropertyPanel(viewer.container, 'propertiesPanel', 'Properties');
    }else{
        propertyPanel.removeAllProperties();
    }

    //Initializing Color Panel
    if (colorPanel == null) {
        colorPanel = new Autodesk.Viewing.UI.PropertyPanel(viewer.container, 'colorsPanel', 'Colors');
    }else{
        colorPanel.removeAllProperties();
    }

    //Initializing Results Panel
    if (resultPanel == null) {
        resultPanel = new Autodesk.Viewing.UI.PropertyPanel(viewer.container, 'resultPanel', 'Results');
    }else{
        resultPanel.removeAllProperties();
    }

    //Read xml file for specific properties
    jQuery.ajax({
        url: '/others/read/xml',
        success: function(res){
            xml_file = res.result
        }
    })

}

function onLoadModelError(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    jQuery('#viewer').html('<p><br><br>Translation in progress... Please try refreshing the page. This could take up to 2-3 minutes</p>');
}

function onItemLoadSuccess(viewer, item) {
    console.log('onItemLoadSuccess()!');
}

function onItemLoadFail(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
    jQuery('#viewer').html('<p>There is an error fetching the translated SVF file. Please try refreshing the page.</p>');
}

// Get Query string from URL
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get public access token for read only
function getForgeToken(callback) {
    jQuery.ajax({
        url: '/api/forge/oAuth2/token/public',
        success: function (res) {
            callback(res.access_token, res.expires_in);
        }
    });
}

function goHome(){
    window.location.href = './main.html';
}