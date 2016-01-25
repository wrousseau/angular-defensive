# angular-defensive

Defensive design for your angular application

[![Travis build status](http://img.shields.io/travis/wrousseau/angular-defensive.svg?style=flat)](https://travis-ci.org/wrousseau/angular-defensive)
[![Dependency Status](https://david-dm.org/wrousseau/angular-defensive.svg)](https://david-dm.org/wrousseau/angular-defensive)
[![devDependency Status](https://david-dm.org/wrousseau/angular-defensive/dev-status.svg)](https://david-dm.org/wrousseau/angular-defensive#info=devDependencies)

# Install

```
bower install --save angular-defensive
````

# Including

```javascript
angular.module('myApp', [..., 'ngDefensive'])
```

# Defining a configuration

Configurations should be registered into a run block. You can add to a configuration as many cases as you want, they will be checked in the same order you added them (first in, first out).

```javascript
.run(function(CheckPreset, DefensiveConfiguration) {
  DefensiveConfiguration.registerConfiguration('requiresNetwork')
	.addCase({
      caseName: 'noNetwork',
			templateUrl: 'templates/no-network.html',
			check: function() {
        return CheckPreset.noNetwork();
      }
	});
})
```

* `caseName` : The name of the case, which you can later use in a controller to specify an action when the defensive template is shown
* `template` : An inline defensive template to show when the `check` function returns `true`. Overrides any given `templateUrl`.
* `templateUrl` : The url to a defensive template  to show when the `check` function returns `true`
* `check` : When returning `true`, the given defensive template will be shown inside any element which uses the `ng-defensive` directive.

# Using the directive

```html
<div ng-defensive="confName" ng-defensive-callbacks="callbacks">
  Normal content
</div>
````

Marking any DOM element with the `ng-defensive` directive will make it check all cases of that configuration in order, showing the first template matching the `check` function which returns true.
