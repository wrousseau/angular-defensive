angular.module('ngDefensiveDemo', ['ngDefensive'])
.config(function(DefensiveConfigurationProvider) {
	DefensiveConfigurationProvider.registerConfiguration('requiresNetwork')
	.addCase({
			template: '<div>requires network : should not show</div>',
			check: function() {
				return false;
			}
	})
	.addCase({
			template: '<div>requires network : should show</div>',
			check: function() {
				return true;
			}
	});
	DefensiveConfigurationProvider.registerConfiguration('requiresGeolocation')
	.addCase({
			templateUrl: 'mytemplate.html',
			template: '<div>override</div>',
			check: function() {
				return true;
			}
	})
	.addCase({
			template: '<div>requires geolocation : should not show</div>',
			check: function() {
				return true;
			}
	});
});
