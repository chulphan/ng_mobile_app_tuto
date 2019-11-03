import { Component, OnInit } from "@angular/core";
import * as SocialShare from "nativescript-social-share";
import { Page } from "tns-core-modules/ui/page";
import { TextField } from "tns-core-modules/ui/text-field";
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryService } from "../../shared/grocery/grocery-list.service";

@Component({
  selector: "list",
  providers: [GroceryService],
  templateUrl: "./list.component.html",
  styleUrls: ["./list-common.css", "./list.css"]
})
export class ListComponent implements OnInit {
  public groceryList: Grocery[] = [];
  public grocery = "";
  public isLoading = false;
  public listLoaded = false;

  constructor(private groceryService: GroceryService, private page: Page) {
    this.isLoading = true;
    this.groceryService.load().subscribe(loadedGroceries => {
      loadedGroceries.forEach(groceryObject => {
        this.groceryList.unshift(groceryObject);
      });
      this.isLoading = false;
      this.listLoaded = true;
    });
  }

  public ngOnInit() {}

  public add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    let textField = <TextField>this.page.getViewById("groceryTextField");
    textField.dismissSoftInput();

    this.groceryService.add(this.grocery).subscribe(
      groceryObject => {
        this.groceryList.unshift(groceryObject);
        this.grocery = "";
      },
      () => {
        alert({
          message: "And error occurred while adding an item to your list.",
          okButtonText: "OK"
        });
        this.grocery = "";
      }
    );
  }

  public delete(item: Grocery) {
    this.groceryService.delete(item).subscribe(() => {
      this.groceryList = this.groceryList.filter(grocery => grocery.id !== item.id);
      alert({
        'message': 'Successfully Deleted',
        okButtonText: 'OK'
      })
    }, (err) => {
      if (err.status === 401) {
        alert({
          'message': 'You dose not have AUTHORIZATION',
          okButtonText: 'OK'
        })
      }
    })
  }

  public share() {
    const list = this.groceryList.map(grocery => grocery.name);
    const listString = list.join(", ").trim();
    SocialShare.shareText(listString);
  }
}
