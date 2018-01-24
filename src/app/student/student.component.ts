import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import {Student} from '../models/student';
import {StudentService} from '../student.service';

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, AfterViewInit {

	private student: Student;
	private  modalEl:any = null; private sort: boolean = true; caret = false;
	private hideScore: boolean = false; private deleteModal: boolean = false;
	private message:string = ''; private index: number;
	private su: boolean =false; private err: boolean =false; 
	private studentArray: Array<any>= [];

  constructor(
  		private studentService:StudentService,
  		private _rootNode: ElementRef
  	) { 
  		this.student = new Student();	
  }

  initForm(){
  	this.hideScore = false;
  	this.student = new Student();
  }

  ngOnInit() {
  	this.getData();
  }

  ngAfterViewInit() {
    this.modalEl = $(this._rootNode.nativeElement).find('div.modal#add-edit-delete-Modal');
  }

  onSubmit(f:any){
  	console.log(this.student);
  	this.studentService.add(this.student).subscribe(
  			res=>{
  				this.message = "Data Added!!!!";
  				this.getData();
  				f.form.reset();
  				this.afterGetSuccRes();
  			}, err=> {
  				this.message = "Adding failed!!!!";
  				this.afterGetErrRes();
  			}
  		);
  	
  }

  getData(){
  	this.studentService.get().subscribe(
  			res=>{
  				if(res!== null) this.studentArray = this.studentService.addKeyObjet(res);
  				console.log(this.studentArray);
  			}, err=> console.log(err)
  		);
  }


  editInit(data:any){
  	this.hideScore = true;
  	sessionStorage.setItem('id', data.id);
  	delete data.id;
  	this.editDeleteInit(data)
  }

  update(){
  	console.log(this.student);
  	let id = sessionStorage.getItem('id');
  	this.studentService.update(id,this.student).subscribe(
  			res=>{
  				this.message = "Data Updated!!!!";
  				this.afterGetSuccRes();
  			}, err=> {
  				this.message = "Updateing failed!!!!";
  				this.afterGetErrRes();
  			}
  		);
  	
  }

  deleteInit(data:any){
    this.deleteModal = true;
    sessionStorage.setItem('id', data.id);
    this.index = this.studentArray.indexOf(data);
    this.editDeleteInit(data);
  }
  
  delete(){ 
  	this.studentArray.splice(this.index,1);
    let id = sessionStorage.getItem('id');
  	this.studentService.delete(id).subscribe(
  			res=>{
  				this.message = "Data Deleted!!!!";
  				this.afterGetSuccRes();
  				this.deleteModal = false;
  			}, err=> {
  				this.message = "Deleting failed!!!!";
  				this.afterGetErrRes();
  			}
  		);
  }

  editDeleteInit(data:any){
    this.modalEl.modal('show');
    this.student = data;
  }

  afterGetSuccRes(){
  	this.su = true;
  	this.modalEl.modal('hide');
  	this.alertFadeAway();
  }

  afterGetErrRes(){
  	this.err = true;
  	this.alertFadeAway();
  }

  alertFadeAway(){
  	setTimeout(()=>{this.message=''
  	this.err = false;
  	this.su = false;
  	},4000);
  }

  sortingStudent(){ 
    this.caret = true;
  	this.studentService.sortStudent(this.studentArray,this.sort);
  	this.sort = !this.sort;
  }

}
