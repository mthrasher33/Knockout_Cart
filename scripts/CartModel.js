//Representation of a product in the user's cart
var CartLine = function() {
    var self = this;
    
    //Two forms of data validation
    //1.Write my own extender to require a product name
    self.name = ko.observable().extend({ required: "Please enter a product name" });
   

    //2.Use knockout-validation.js to require positive numbers
    self.quantity = ko.observable(1).extend({
        digit: true,
        required: true,
        decorateElement : true
    });
    self.price = ko.observable(0).extend({
        digit: true,
        required: true
    });
    self.subtotal = ko.computed(function() {
        return parseInt(self.price()) * parseInt(self.quantity())
    });

};

//Representation of user's cart
var Cart = function() {
    // Stores an array of user's item, and from these, can work out the grandTotal
    var self = this;
    self.lines = ko.observableArray([new CartLine()]); // Put one line in by default so that user can enter item
    self.grandTotal = ko.computed(function() {
        var total = 0;
        $.each(self.lines(), function() { total += this.subtotal() })
        return total;
    });

    // Operations
    self.addLine = function() { 

        self.lines.push(new CartLine());
    };

    self.removeLine = function(line) { self.lines.remove(line) };

};

//Extenders for form validation
//Source: http://knockoutjs.com/documentation/extenders.html
ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
     target.hasError(newValue ? false : true);
     target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
 }
 
    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};



//Apply cart model to view
ko.applyBindings(new Cart());



//Comparison function used to sort user items by name.
 function compareByProductName(a,b) {
  if(b.name()){  //If there is no b, then b.name() is undefined and can't be sent to toLowerCase()
      if (a.name().toLowerCase() < b.name().toLowerCase())
        return -1;
    else if (a.name().toLowerCase() > b.name().toLowerCase())
        return 1;
    else 
        return 0;
}
}

//Formats currency to dollars
function formatCurrency(value) {
    return "$" + value.toFixed(2);
}




