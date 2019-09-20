import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  toDoListArray: any[];
  dt = new Date();
  toDoList: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private updates: SwUpdate) {

  }
  ngOnInit() {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        if (confirm("New Version found load new?")) {
          window.location.reload();
        }
      })
    }
    this.toDoList = this.db.list('titles');
    return this.toDoList.snapshotChanges().subscribe(item => {
      this.toDoListArray = [];
      item.forEach(k => {
        var x = k.payload.toJSON();
        x["id"] = k.key;
        this.toDoListArray.push(x);
      })
      this.toDoListArray.sort((a, b) => {
        return a.isChecked - b.isChecked;
      })
    });
  }
  onAdd(itemTitle) {
    this.toDoList.push({
      title: itemTitle.value,
      isChecked: false
    });
    itemTitle.value = null;
  }
  alterCheck(id, isChecked) {
    this.toDoList.update(id, { isChecked: !isChecked });
  }
  onDelete(id) {
    this.toDoList.remove(id);
  }

}
