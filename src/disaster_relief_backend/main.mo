import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";


actor DisasterReliefBackend {

  // Define user roles
  public type Role = {
    #Victim;
    #Volunteer;
    #NGO;
  };

  // Define user data structure
  public type User = {
    id: Principal;  // Unique identifier (Internet Identity)
    role: Role;
    name: Text;
    email: Text;
  };

  // Use a stable array instead of TrieMap
  private stable var users : [User] = [];

  // Register a new user
  public shared ({caller}) func registerUser(role: Role, name: Text, email: Text) : async Text {
    for (user in users.vals()) {
        if (user.id == caller) {
            return "User already registered.";
        }
    };

    let newUser: User = {
        id = caller;
        role = role;
        name = name;
        email = email;
    };

    // Append new user to the stable array
    users := Array.append(users, [newUser]);

    return "User registered successfully!";
  };

  // Fetch user details
  public shared query ({caller}) func getUser() : async ?User {
    for (user in users.vals()) {
      if (user.id == caller) {
        return ?user;
      }
    };
    return null;
  };

}; 
