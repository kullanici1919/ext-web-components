class ExtBase extends HTMLElement {

  constructor() {
    super();
    console.log('hi')
    this._prevProps = {}
  }

  static get observedAttributes() {
    var attrs = []
    for (var property in this.PROPERTIESOBJECT) {
      if (this.PROPERTIESOBJECT.hasOwnProperty(property)) {
        if(this.getAttribute(property) !== null) {
          attrs.push(property)
        }
      }
    }
    this.EVENTS().forEach(function (eventparameter, index, array) {
      attrs.push('on'+eventparameter.name)
    })
    return attrs
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    console.log('attributeChangedCallback (attr,oldVal,newVal)',attr,oldVal,newVal)
    if (/^on/.test(attr)) {
      if (newVal) {
        this[attr] = newVal;
        this.addEventListener(attr.slice(2), function() {evaconsole.log(this[attr])});
      } else {
        delete this[attr];
        this.removeEventListener(attr.slice(2), this);
      }
    } else {
      // if(attr == 'config' && newVal != null && this._config == undefined) {
      // 	this._config = newVal
      // }
      if (this.ext === undefined) {
        //console.log('this.ext is undefined')
        //this.connectedCallback()
        //console.log('after')
      }
      else {
        var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
        this.ext[method](newVal)
      }
    }
  }

	setEvent(eventparameters,o,me) {
		o.listeners[eventparameters.name] = function() {
			let eventname = eventparameters.name
			let parameters = eventparameters.parameters;
			let parms = parameters.split(',');
			let args = Array.prototype.slice.call(arguments);
			let event = {};
			for (let i = 0, j = parms.length; i < j; i++ ) {
					event[parms[i]] = args[i];
			}
			me.dispatchEvent(new CustomEvent(eventname,{detail: event}))
		}
	}

	disconnectedCallback() {
		delete this.ext
		console.log('ExtBase disconnectedCallback')
	}

  addTheChild(parentCmp, childCmp) {
    var parentxtype = parentCmp.xtype
    var childxtype = childCmp.xtype

    if (this.ext.initialConfig.align != undefined) {
      if (parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'button') {
        console.error('Can only use align property if parent is a Titlebar or Grid or Button')
        return
      }
    }
    if (parentxtype === 'grid' || parentxtype === 'lockedgrid') {
      if (childxtype === 'column' || childxtype === 'treecolumn' || childxtype === 'textcolumn' || childxtype === 'checkcolumn' || childxtype === 'datecolumn' || childxtype === 'rownumberer' || childxtype === 'numbercolumn' || childxtype === 'booleancolumn' ) {
        parentCmp.addColumn(childCmp)
        return
      }
      else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
        if (parentCmp.getHideHeaders() === false) {
          parentCmp.insert(1, childCmp);
          //console.log('**')
          return
        }
        else {
          parentCmp.add(childCmp);
          //console.log('**')
          return
        }
      }
      else {
        console.log('unhandled else in addTheChild')
        console.log(parentxtype)
        console.log(childxtype)
      }
    } 
    if (childxtype === 'tooltip') {
      parentCmp.setTooltip(childCmp)
      //console.log('**')
      return
    } 
    if (childxtype === 'plugin') {
      parentCmp.setPlugin(childCmp)
      //console.log('**')
      return
    } 
    else if (parentxtype === 'button') {
      if (childxtype === 'menu') {
        parentCmp.setMenu(childCmp)
        //console.log('**')
        return
      } else {
        console.log('child not added')
      }
    } 
    if (childxtype === 'toolbar' && Ext.isClassic === true) {
      parentCmp.addDockedItems(childCmp)
      //console.log('**')
      return
    } 
    else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
      if (parentCmp.getHideHeaders() === false) {
        parentCmp.insert(1, childCmp)
        //console.log('**')
        return
      } else {
        parentCmp.add(childCmp)
        //console.log('**')
        return
      }
    } 
     if (parentCmp.add != undefined) {
      parentCmp.add(childCmp)
      //console.log('**')
      return
    }
    console.log('child not added')
  }

  connectedCallback() {
    var nodeName = this.nodeName
    var nodeParentName = this.parentNode.nodeName
    console.dir(nodeName + ' ,parent: ' + nodeParentName)
    var parentCmp = this.parentNode['ext']
    var childCmp;
    var me = this
    var props = {}
    for (var property in me.PROPERTIESOBJECT) {
      if (me.PROPERTIESOBJECT.hasOwnProperty(property)) {
        if(me.getAttribute(property) !== null) {
          props[property] =  me[property]
        }
      }
    }
    var o = props
    o.xtype = me.XTYPE
    if (nodeParentName == 'BODY') {
      Ext.application({
        name: 'MyExtWCApp',
        launch: function () {
          console.log('\nXTYPE: ' + o.xtype)
          console.log('parent: ' + nodeParentName)
          me.ext = Ext.create(o)
          if (nodeParentName == 'BODY') {
            Ext.Viewport.add([me.ext])
          }
        }
      });
    }
    else{
      Ext.onReady(function(){
        console.log('\nXTYPE: ' + o.xtype)
        console.log('parent: ' + nodeParentName)
        me.ext = Ext.create(o)
        parentCmp = me.parentNode['ext'];
        childCmp = me.ext;
        console.log(`parentCmp: ${parentCmp.xtype} childCmp: ${childCmp.xtype}`)
        me.addTheChild(parentCmp, childCmp)
      });
    }
  }




  xconnectedCallback(o) {
    var nodeName = this.nodeName
    var nodeParentName = this.parentNode.nodeName
    console.dir(nodeName + ' ,parent: ' + nodeParentName)
    var parentCmp = this.parentNode['ext']
    var childCmp;

    var me = this
    if (nodeParentName == 'BODY') {
      Ext.application({
        name: 'MyExtWCApp',
        launch: function () {
          console.log('\nXTYPE: ' + o.xtype)
          console.log('parent: ' + nodeParentName)
          me.ext = Ext.create(o)
          if (nodeParentName == 'BODY') {
            Ext.Viewport.add([me.ext])
          }
        }
      });
    }
    else{
      Ext.onReady(function(){
        console.log('\nXTYPE: ' + o.xtype)
        console.log('parent: ' + nodeParentName)
        me.ext = Ext.create(o)
        parentCmp = me.parentNode['ext'];
        childCmp = me.ext;
        console.log(`parentCmp: ${parentCmp.xtype} childCmp: ${childCmp.xtype}`)
        me.addTheChild(parentCmp, childCmp)
      });
    }
  }

}