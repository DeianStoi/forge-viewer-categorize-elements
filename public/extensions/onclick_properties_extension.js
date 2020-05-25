function OnClickProperties(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}
  
OnClickProperties.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
OnClickProperties.prototype.constructor = OnClickProperties;

OnClickProperties.prototype.onSelectionEvent = function(event) {
  
  var viewer = this.viewer;

  var currSelection = viewer.getSelection();

  var itemSelected = document.getElementById('selectionValue');
  itemSelected.innerText = currSelection.length;

  propertyPanel.removeAllProperties();

  //Get the selection and find the properties for the current selection
  var selection = viewer.getSelection();
    selection.forEach(function (dbId){
      viewer.getProperties(dbId, function(props){

        propertyPanel.addProperty('Forge Name', props.name);
        propertyPanel.addProperty('dbId', props.dbId);

        props.properties.forEach(function(prop){
          //Show only ifc properties
          if (propertySet == 'ifc'){
            if(prop.displayName.includes('Ifc')){
              propertyPanel.addProperty(prop.displayName, prop.displayValue);
            }
          }else{
            propertyPanel.addProperty(prop.displayName, prop.displayValue);
          }
        });
      });
    })

    propertyPanel.onPropertyClick = function(property){
      //Custom search which looks in all object for the certain properties
      //There is also a build-in search funtion, but doesn't work as desired
      var instanceTree = viewer.model.getData().instanceTree;
      var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
      var idss = allDbIdsStr.map(function(id) { return parseInt(id)});
      
      //When clicked on a property -> find all elements in the viewer with this property
      idss.forEach(function (currentId){
        viewer.getProperties(currentId, function (propers){
          if(propers.properties.length > 6){
            //Forge name is not in propers.properties
            if(property.name == 'Forge Name' && property.value == propers.name){
              if(fileType == 'ifc'){
                viewer.setThemingColor(propers.dbId, color, viewer.model, true);
              }else{
                viewer.setThemingColor(propers.dbId, color);
              }
            //Forge dbId is not in propers.properties
            }else if(property.name == 'dbId' && property.value == propers.dbId){
              if(fileType == 'ifc'){
                viewer.setThemingColor(propers.dbId, color, viewer.model, true);
              }else{
                viewer.setThemingColor(propers.dbId, color);
              }
            //Everything else is in propers.properties
            }else{
            propers.properties.forEach(function (prop){
              if(property.name == prop.displayName && property.value == prop.displayValue){
                if(fileType == 'ifc'){
                  viewer.setThemingColor(propers.dbId, color, viewer.model, true);
                }else{
                  viewer.setThemingColor(propers.dbId, color);
                }
              }
            });
          }
          }
          
        })
      })

      //--> Search from Forge API = works good but not for all elements
      /*
      viewer.search(property.value, function (elementIds){
        elementIds.forEach(function (elementId){
            viewer.setThemingColor(elementId, color, viewer.model, true);
        });
      });
      */
    }

};

OnClickProperties.prototype.load = function() {
    this.onSelectionBinded = this.onSelectionEvent.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    return true;
};

OnClickProperties.prototype.unload = function() {
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.onSelectionBinded = null;
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('OnClickProperties', OnClickProperties);