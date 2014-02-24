Posts = new Meteor.Collection("Posts");

if (Meteor.isServer) {
  if (Posts.find().count() == 0) {
    for (var i = 1; i <= 10; i++) {
      var _id = Posts.insert({
        title: "Post " + i,
        body: "This is post " + i
      });
      console.log("Inserted :" + _id);
    }
  }
  Meteor.publish("post", function (_id) {
    return Posts.find({_id: _id});
  });
  Meteor.publish("posts", function () {
    return Posts.find({},{limit:5});
  });
}

if (Meteor.isClient) {

  Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
  });


  Router.map(function () {

    this.route("home", {
      path: "/",
      template: "loading",
      waitOn: function () {
        return Meteor.subscribe("posts");
      },
      action: function(){
        console.log("home");
        var post = Posts.findOne();
        var path = Router.routes['post'].path({_id: post._id});
        Router.go(path,{},{replaceState:true});
      }
    });

    this.route("post", {
        path: "/post/:_id",
        template: "post",
        waitOn: function () {
          return Meteor.subscribe("post", this.params._id);
        },
        data: function () {
          return Posts.findOne({_id: this.params._id});
        }
      }
    );
  });
}