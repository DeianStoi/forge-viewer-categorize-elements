function ToolbarExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}
  
ToolbarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolbarExtension.prototype.constructor = ToolbarExtension;

ToolbarExtension.prototype.load = function() {

    if (this.viewer.toolbar) {
      // Toolbar is already available, create the UI
      this.createUI();
    } else {
      // Toolbar hasn't been created yet, wait until we get notification of its creation
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
  
    return true;
  };

  ToolbarExtension.prototype.unload = function() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  };
  
  ToolbarExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
  };
  
  ToolbarExtension.prototype.createUI = function() {
    var viewer = this.viewer;

    // Button to open the properties panel
    var buttonProperties = new Autodesk.Viewing.UI.Button('propertiesButton');
    buttonProperties.onClick = function(e) {
      
      propertyPanel.container.style.height = '400px';
      propertyPanel.container.style.width = '400px';
      propertyPanel.container.style.top = '100px';

      propertyPanel.setVisible(true);
      
    };
    buttonProperties.addClass('propertiesButton');
    buttonProperties.setToolTip('Properties');

    // Button to open the color panel
    var buttonColors = new Autodesk.Viewing.UI.Button('colorButton');
    buttonColors.onClick = function(e) {

      colorPanel.removeAllProperties();

      colorPanel.addProperty('Red', [1,0,0]);
      colorPanel.addProperty('Green', [0,1,0]);
      colorPanel.addProperty('Blue', [0,0,1]);
      colorPanel.addProperty('Yellow', [1,1,0]);
      colorPanel.addProperty('Cyan', [0,1,1]);
      colorPanel.addProperty('Pink', [1,0,1]);

      colorPanel.onPropertyClick = function(property){
        var red = property.value[0];
        var green = property.value[1];
        var blue = property.value[2];

        color = new THREE.Vector4(red, green, blue, 0.8);

        document.getElementById('colorButton').style.backgroundColor = 'rgb('+ (red*255).toString()+','+ (green*255).toString()+','+ (blue*255).toString()+')';
        buttonColors.setToolTip(property.name);
      }

      colorPanel.container.style.top = '500px';
      colorPanel.setVisible(true);

    };
    buttonColors.addClass('colorButton');
    buttonColors.setToolTip('Red');

    //Button to clear all colors that have been set to the viewer
    var buttonClearColors = new Autodesk.Viewing.UI.Button('clearColorsButton');
    buttonClearColors.onClick = function(e){
      viewer.clearThemingColors();
    };
    buttonClearColors.addClass('clearColorsButton');
    buttonClearColors.setToolTip('Clear colors');

    //Button to find all elements in the viewer with specific XML criteria
    var buttonXml = new Autodesk.Viewing.UI.Button('xmlButton');
    buttonXml.onClick = function(e){

      //Initialize resultPanel
      resultPanel.removeAllProperties();
      resultPanel.container.style.height = '250px';
      resultPanel.container.style.width = '500px';
      resultPanel.container.style.top = '0px';
      resultPanel.setVisible(true);

      //Get all objects in the viewer
      var instanceTree = viewer.model.getData().instanceTree;
      var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
      var idss = allDbIdsStr.map(function(id) { return parseInt(id)});

      //Iterate through all of the properties defined in the xml file
      for (i in xml_file){
        var xml_properties = Object.entries(xml_file[i]);

        for (i in xml_properties){
          let propName = xml_properties[i][0];
          let xmlCurrproperties = xml_properties[i][1];
          let currProperties = Object.entries(xmlCurrproperties[0]);

          //These are dictionaries with keys-value pairs
          let propertyPairs = currProperties[0][1][0];
          let colorPairs = currProperties[1][1][0];

          //Find how many properties of the current element
          let num_prop = Object.keys(propertyPairs).length;
          let num_results = 0;

          //Find all objects that have the same properties as the defined in the xml file
          idss.forEach(function (currentId){
            viewer.getProperties(currentId, function (propers){
              if (propers.properties.length > 15){
                var count = 0;
                var result_names = [];
                //Iterate through all of the properties of the viewer objects and find the ones
                //that correspond to the given properties
                propers.properties.forEach(function(prop){
                  for (key in propertyPairs){
                    var name = key;
                    var value = propertyPairs[key][0];
                    if(prop.displayName == name && prop.displayValue == value && !result_names.includes(name)){
                      count++;
                      result_names.push(name);
                    }
                  }
                })
                if (count >= num_prop){
                  
                  //Delete the last property that was added, because of the scope of the variables in javascrpt
                  resultPanel.removeProperty(propName, num_results, 'Quantity');
                  
                  //Number of results that is shown in the result panel
                  num_results++;

                  //Create color for the current element from the XML file
                  var red = colorPairs['red'][0];
                  var green = colorPairs['green'][0];
                  var blue = colorPairs['blue'][0];
                  color = new THREE.Vector4(red, green, blue, 0.8);

                  //Add color to the objects
                  if(fileType == 'ifc'){
                    viewer.setThemingColor(currentId, color, viewer.model, true);
                  }else{
                    viewer.setThemingColor(currentId, color);
                  }

                  //Add the quantity of the current object
                  resultPanel.addProperty(propName, num_results, 'Quantity');
                
                }
              }
              
            })
          })
        }
      }
    };
    buttonXml.addClass('xmlButton');
    buttonXml.setToolTip('XML File');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('categorizeElementsToolbar');
    this.subToolbar.addControl(buttonProperties);
    this.subToolbar.addControl(buttonColors);
    this.subToolbar.addControl(buttonClearColors);
    this.subToolbar.addControl(buttonXml);


    viewer.toolbar.addControl(this.subToolbar);
    };

  Autodesk.Viewing.theExtensionManager.registerExtension('CategorizeElementsExtension', ToolbarExtension);