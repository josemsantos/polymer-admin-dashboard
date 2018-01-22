# Polymer Admin

Polymer admin is a backoffice tool/interface to manage user actions and interactions on REST API based platforms.

  - Ease the creation on lists and forms
  - Add Role-based access control to resources
  - Brings user management out of the box
  - Magic

You can also:
  - Add all your modules
  - Extend the power of Polymer to create your own elements
  - Easily add many different connections to different API's (Although we think you should have a single endpoint for all your services)

## How to install and start the application

##### Prerequisites
Install [npm](https://nodejs.org/en/download/):

    Download the installer adequate to your OS version. Make sure you install the most recent version of Node.js. It should be at least above 4.x.

Install [bower](https://github.com/bower/bower):

    npm install -g bower

Install [polymer-cli](https://github.com/Polymer/polymer-cli):

    npm install -g polymer-cli


##### Clone the project

    git clone git@github.com:josemsantos/polymer-admin-dashboard.git
    cd polymer-admin-dashboard
    cp parameters.dist.json parameters.json

### Install dependencies

Install all the npm dependencies set in the `package.json` file

    npm install

Install all the bower dependencies set in the `bower.json` file

    bower install

##### Build to apply parameters values

Run the gulp task to build the parameters

    gulp

*`gulp` should have been installed by the npm install command*

## How To

### Create a new module

This manual is intended to

* Add a new endpoint to connect to
* Learn on how to add a new basic module with CRUD actions
* Connect all actions to the user roles
* Add an menu item if the user has permissions to access the module list
* Create a model representation of the data to be submitted
* Deal with actions and validations

### The Polymer Admin structure

* configs - The config files to setup your application connections and the lazy load of modules actions
* elements - The Polymer Admin elements collection. Each element has is own responsability and allows to compose this model of list/forms structure backoffice
* lib - A set of behaviors to use as helpers
* models - the models folder. Each model should extends the `ModelBehavior` to take advantage of predefined CRUD actions.
* modules - the modules folder. Each module should contain one action per element. The name convention should be `module-action.html`. Each element should extends the `ModuleElementBehavior` to benefit of RBAC and *"magic"*.
* other files in the src folder
  * my-icons.html: A collection of icons
  * shared-styles.html: A collection of styles to be used across the platform
  * dash-app.html: The main controller of the Polymer admin

### Add a new endpoint to connect to

To add an API endpoint to the application go to `src/configs/connection.html`
In the `window.Dash.connections` object add a new item:
```js
window.Dash.connections = {
  'seraph': {
    'url': 'http://hostname.tld:8080/some-url',
    'headers': {
    }
  },
}
```
You can predefined a set of headers to be passed.

### Learn on how to add a new basic module with CRUD actions

Let's assume we want to create a **CMS module**, this module will have a menu group item called `Content Management` and an menu item called `Static Content`. When the user clicks on the Static Content the application will open the list of all Static contents and the user if granted will be able to filter, sort or navigate in the list and to create, edit or delete an cms item.

### Add the CMS model to be used by the module
In the model folder add a cms-model.html element
This element should:

* Extend the `ModelBehavior`
* Include a `model` property with a static value of a Object that represents the model
```js
static get properties() {
    return {
      model: {
        type: Object,
        value: {
          id: null,
          key: null,
          name: null,
          content: null
        }
      }
    };
  }
```
* on the constructor define the endpoint value to fetch or edit the content
```js
constructor() {
    super();
    this.endpoint = '/content/cms';
}
```
* Create a method to get the form representation of this resource the standard name should be like `getForm()`
 * This should return an object with two properties, **fields** and **actions** 
 * The field should contain a label, name, type and an array of validators
 * The actions should tell in the key the type of action (delete, edit, create) and have a label and and event to be called or a goto to navigate when executed.
 * The `ModelBehavior` have a search, create, update and delete methods implemented and when executed with success the user can extends and make use of the pos action callbacks: _posCreateCallBack, _posUpdateCallBack and _posDeleteCallBack


### Create the module list

To add a new module create a new folder called cms inside the module folder.
Keep in mind that any action element extends the `ModuleElementBehavior`, in order to properly use the best of this helper you should declare in the element which pageType you are extending
```js
static get properties() {
    return {
      pageType: {
        type: String,
        value: 'form'
      },
    };
}
```

Add a new Polymer element called cms-list.html inside the folder.
This element should:

* Extend the `ModuleElementBehavior`
* Include a `dash-list` element in the dom-module
* Include a cms-model representation to map between requests
* On the constructor declare the name of the model to be used 
```js
constructor() {
    super();
    this.model = 'cms-model';
}
```
* You can add more things to make your list cooler like, add a eventListener in the ready method to notify the user when an item is deleted in the list
```js
ready() {
    super.ready();
    this.addEventListener('delete-cms', function (e) {
      let item = this.getItem(this.items, e.detail.key);
      this._alert({
        'key': item.id,
        'message': item.name
      });
    }.bind(this));
}
```

The dash-list element has many options and events:
* **heading**: The header html content of the list,
* **icon**: The icon name for the header next to the heading,
* **headingStyle**: predefined style for the header,
* **key**: the property that works as a unique identifier,
* **columns**: An array of columns
* **actions**: All possible actions on each item
* **filters**: An array of fields to be used to search,
* **items**: The data array
* **totalItems**: Total number of items found in the resource,
* **customPagination**: use the dash custom pager instead of the paper-datatable one,
* **page**: the user current page number 
* **selectedRows**: If used the rows selected by the user
* **itemsPerPage**: Total number of items in each page
* **notifySuccess**: If it should notify in case of any successful action

### Create the module form

Add a new Polymer element called cms-edit.html inside the folder.
This element should:

* Extend the `ModuleElementBehavior`
* Include a `dash-form` element in the dom-module
* Include a `app-route` element in the dom-module to know which element key you are trying to get
* Include a cms-model representation to map between requests
* On the constructor declare the name of the model to be used 
```js
constructor() {
    super();
    this.model = 'cms-model';
}
```
* On the ready method your should try to get the right model you want to apply crud actions to. Then you should get from the model the form configuration. It is important to tell to the `ModuleElementBehavior` that you are ready for it to start fetching the data and if needed add any event listener to execute any action in the model

```js
ready() {
    super.ready();
    this.cmsModel = this.shadowRoot.querySelector(this.model);
    this.form = this.cmsModel.getForm();

    this.actions = this.form.actions;
    this.isReady = true;

    this.addEventListener('delete-cms', function (e) {
      this._alert({
        'key': this.key,
        'message': this.data.name
      });
    }.bind(this));

    this.addEventListener('update-cms', function (e) {
      this._updateCMS(e);
      ....
    });
}
```
Some properties may be needed:
* connection: Tell the form which connection to use
* pageType: Should be static with the value `"form"`
* data: The form data 
* externalData: if any of the form elements use a collection of items fetched from a different resource it should be passed to this property
* payload: An array of which properties of the model should be sent in the payload. This way you can filter out unecessary pair of properties/values (readonly fields or immutable fields.

The dash-form element has many options and events:
* **class**: The form main style,
* **hasCancel**: If the form should have a cancel action,
* **key**: The key id value that identifies which data you are trying to get,
* **model**: The model represention from the model element,
* **fields**: An array of form fields
* **actions**: All possible actions on the form
* **modelData**: The model data fetched from the resource,
* **externalResources**: The data fetched from a external resource
* **notifyError**: if it should notify in case of any error
* **notifySuccess**: if it should notify in case of any successful action
* **onCancel**: Event on the cancel action clicked
* **onSubmit**: Event on the submit action clicked

### let's register the module and connect it to the RBAC manager and to the menu
Inside the module folder add a new element called `cms-module-registration.html`
This element should be a Polymer Behavior and should contain all possible actions with the expected roles to be granted. The menu group and menu item definitions. Check the `group-module-registration.html`has an example.

Import your element insode the `src\modules\module-registration.html` element. The `ModuleRegistration` should extend your register and you will only need to call _addModules inside the register method with the module property name.
```js
function ModuleRegistration(superClass) {
      return class extends CmsModuleRegistration(
                            UserModuleRegistration(
                            UsersModuleRegistration(
                            GroupsModuleRegistration(superClass)))) {
    ....
    
    register () {
      ....
      this._addModules(this.cms_module);
      ....
      this.dispatchEvent(new CustomEvent('dash-modules-registered', {
        detail: this.modules,
        bubbles: true, 
        composed: true
      }));
    }
```

Now your new module should be available in the menu, make sure you have the right grant access.
To make the list available in the application import the cms-list.html and cms-edit.html elements in the `src\config\lazy-imports.html`

```html
<link rel="lazy-import" href="../modules/cms/cms-list.html">
<link rel="lazy-import" href="../modules/cms/cms-edit.html">
```

And add the elements inside the iron-page element in the dash-app.html element

```html
    <cms-list 
      permissions="[[permissions]]" 
      name="cms-list"></cms-list>
    <cms-edit 
      permissions="[[permissions]]" 
      name="cms-edit"
      route="[[subroute]]"></cms-edit>
```

The permissions property will pass to the element all the grant acess from the user. The subroute for the edit element will contain the key value of the element that the user is trying to edit.

License
----

MIT


**Free Software, Hell Yeah!**
