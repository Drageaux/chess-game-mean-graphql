import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GetUsersGQL, User } from '@app/types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user: Observable<User>;
  users: Observable<User[]>;
  constructor(private getUsersGQL: GetUsersGQL) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.users = this.getUsersGQL
      .watch()
      .valueChanges.pipe(map(result => result.data.getUsers));
  }

  // /**
  //  * Create User
  //  * @param value     Name of User
  //  */
  // createUser(value) {
  //   this.apollo
  //     .mutate({
  //       mutation: UsersQuery.addUser,
  //       variables: {
  //         name: value
  //       },
  //       update: (proxy, { data: { addUser } }) => {
  //         // Read the data from our cache for this query.
  //         const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

  //         data.users.push(addUser);

  //         // Write our data back to the cache.
  //         proxy.writeQuery({ query: UsersQuery.allUsers, data });
  //       }
  //     })
  //     .subscribe(
  //       ({ data }) => {
  //         console.log('success: ', data);
  //       },
  //       error => {
  //         console.log('there was an error sending the query', error);
  //       }
  //     );
  // }

  // /**
  //  * Remove User
  //  */
  // removeUser(id) {
  //   this.apollo
  //     .mutate({
  //       mutation: UsersQuery.removeUser,
  //       variables: {
  //         id
  //       },
  //       update: (proxy, { data: { removeUser } }) => {
  //         // Read the data from our cache for this query.
  //         const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

  //         const index = data.users
  //           .map(x => {
  //             return x.id;
  //           })
  //           .indexOf(id);

  //         data.users.splice(index, 1);

  //         // Write our data back to the cache.
  //         proxy.writeQuery({ query: UsersQuery.allUsers, data });
  //       }
  //     })
  //     .subscribe(
  //       ({ data }) => {
  //         console.log('success: ', data);
  //       },
  //       error => {
  //         console.log('there was an error sending the query', error);
  //       }
  //     );
  // }

  // /**
  //  * Update User
  //  */
  // updateUser(user) {
  //   this.apollo
  //     .mutate({
  //       mutation: UsersQuery.updateUser,
  //       variables: {
  //         id: this.user.id,
  //         name: user
  //       },
  //       update: (proxy, { data: { updateUser } }) => {
  //         // Read the data from our cache for this query.
  //         const data: any = proxy.readQuery({ query: UsersQuery.allUsers });

  //         const index = data.users
  //           .map(x => {
  //             return x.id;
  //           })
  //           .indexOf(this.user.id);

  //         data.users[index].name = user;

  //         // Write our data back to the cache.
  //         proxy.writeQuery({ query: UsersQuery.allUsers, data });
  //       }
  //     })
  //     .subscribe(
  //       ({ data }) => {
  //         console.log('success: ', data);
  //       },
  //       error => {
  //         console.log('there was an error sending the query', error);
  //       }
  //     );
  // }
}
