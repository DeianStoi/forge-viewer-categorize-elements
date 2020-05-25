function ChangeSelectionExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }
  
  ChangeSelectionExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
  ChangeSelectionExtension.prototype.constructor = ChangeSelectionExtension;

ChangeSelectionExtension.prototype.load = function() {

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

  ChangeSelectionExtension.prototype.unload = function() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  };
  
  ChangeSelectionExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
  };
  
  ChangeSelectionExtension.prototype.createUI = function() {
    var viewer = this.viewer;

    // Button 1
    var button1 = new Autodesk.Viewing.UI.Button('changePropertySet');
    button1.onClick = function(e) {
      if(fileType == 'ifc'){
        if(propertySet == 'all'){
            propertySet = 'ifc';
        }else{
            propertySet = 'all';
        }
      }
    };
    button1.addClass('changePropertySet');
    button1.setToolTip('Change property set');

    // Button 2
    var button2 = new Autodesk.Viewing.UI.Button('changeSelection');
    button2.onClick = function(e) {
      if(fileType == 'ifc'){
        if(selectionMode == 'one'){
            viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.FIRST_OBJECT);
            selectionMode = 'all';
        }else{
            viewer.setSelectionMode(Autodesk.Viewing.SelectionMode.LEAF_OBJECT);
            selectionMode = 'one';
        }
      }
    };
    button2.addClass('changeSelection');
    button2.setToolTip('Change selection');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('changeSelectionToolbar');
    this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);

    viewer.toolbar.addControl(this.subToolbar);
    };

  Autodesk.Viewing.theExtensionManager.registerExtension('ChangeSelectionExtension', ChangeSelectionExtension);