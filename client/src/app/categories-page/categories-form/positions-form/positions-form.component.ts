import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../../../shared/services/position.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modelRef: ElementRef;

  loading = false;
  positions: Position[] = [];
  modal: MaterialInstance

  constructor(
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe((positions)=>{
      this.positions = positions;
      this.loading = false;
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modelRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  onSelectPosition(position: Position) {
    this.modal.open();
  }

  onAddPosition() {
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }
}
