import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
// import * as UsersQuery from './users.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user: any;
  users: any[] = [];
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getUsers();
  }

  /**
   * Create User
   * @param value     Name of User
   */
  createUser(value) {
    this.apollo
      .mutate({
        mutation: UsersQuery.addUser,
        variables: {
          name: value
        },
        update: (proxy, { data: { addUser } }) => {
          // Read the data from our cache for this query.
          const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

          data.users.push(addUser);

          // Write our data back to the cache.
          proxy.writeQuery({ query: UsersQuery.allUsers, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('success: ', data);
        },
        error => {
          console.log('there was an error sending the query', error);
        }
      );
  }

  /**
   * Remove User
   */
  removeUser(id) {
    this.apollo
      .mutate({
        mutation: UsersQuery.removeUser,
        variables: {
          id
        },
        update: (proxy, { data: { removeUser } }) => {
          // Read the data from our cache for this query.
          const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

          const index = data.users
            .map(x => {
              return x.id;
            })
            .indexOf(id);

          data.users.splice(index, 1);

          // Write our data back to the cache.
          proxy.writeQuery({ query: UsersQuery.allUsers, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('success: ', data);
        },
        error => {
          console.log('there was an error sending the query', error);
        }
      );
  }

  /**
   * Update User
   */
  updateUser(user) {
    this.apollo
      .mutate({
        mutation: UsersQuery.updateUser,
        variables: {
          id: this.user.id,
          name: user
        },
        update: (proxy, { data: { updateUser } }) => {
          // Read the data from our cache for this query.
          const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

          const index = data.users
            .map(x => {
              return x.id;
            })
            .indexOf(this.user.id);

          data.users[index].name = user;

          // Write our data back to the cache.
          proxy.writeQuery({ query: UsersQuery.allUsers, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('success: ', data);
        },
        error => {
          console.log('there was an error sending the query', error);
        }
      );
  }

  /**
   * ----------------------------------------------------
   * Get All Users
   * ----------------------------------------------------
   * @method getUsers
   */
  getUsers() {
    this.apollo
      .watchQuery({ query: UsersQuery.allUsers })
      .valueChanges.pipe(map((result: any) => result.data.allUsers))
      .subscribe(data => {
        this.users = data;
      });
  }
}
