// @flow

import React from 'react';
import { CategoryService, IssueService } from '../../services';
import Grid from 'react-bootstrap/es/Grid';
import { Alert } from '../../widgets';
import Row from 'react-bootstrap/es/Row';
import Col from 'react-bootstrap/es/Col';
import { Status } from '../../classTypes';
import ProgressBar from 'react-bootstrap/es/ProgressBar';
import Image from 'react-bootstrap/es/Image';
import * as jwt from 'jsonwebtoken';
import Button from 'react-bootstrap/es/Button';
import { ImageService } from '../../services';
import { history } from '../../index';
import css from './oversiktOverSak.css';
import{FormGroup} from "react-bootstrap";
import {FormControl} from "react-bootstrap";
import Card from "reactstrap/es/Card";
import Table from "react-bootstrap/es/Table";

let issueService = new IssueService();
let categoryService = new CategoryService();
let imageService = new ImageService();

interface State {
  issue: Object[];
  category1: Object[];
  category2: Object[];
  category3: Object[];
  status: Status;
  statusName: string;
  categoryLevel: number;
  editCase: boolean;
  comment: string;
  image: Image;
}//end method

export class OversiktOverSak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: {},
      issue: {},
      category1: {},
      category2: {},
      category3: {},
      status: {},
      statusName: '',
      categoryLevel: 1, //1 means the issue is not registered under any subcategories
      editCase: false, //if the issue is in progress or completed, user cannot edit issue
      comment: '',
      issueComments: [],
      editStatus: <div>
          <Row>
              <Col xs={12} md={8}>
            <select onChange={this.setStatus}>
              <option value="">Oppdater status</option>
              <option value="In progress">Behandles</option>
              <option value="Completed"> Fullført</option>
            </select>
              </Col>
          </Row>
          <Row>
              <Col xs={3} md={3}>
                <Button onClick={this.saveThisStatus}> Lagre status</Button>
              </Col>
          </Row>
      </div>
    };
  }//end constructor


    render(){
       let editStatus;
       let renderComment;
       let decoded = jwt.verify(window.localStorage.getItem('userToken'), 'shhhhhverysecret');
        if(decoded.typeId === 'Company' || decoded.typeId === 'Admin' || decoded.typeId === 'Employee'){
            editStatus = this.state.editStatus;
            renderComment = <div>
                <br/>

                <FormGroup>
                    <FormControl componentClass="textarea" value={this.state.comment} placeholder="Legg til kommentar til sak"
                    onChange={this.editComment}/>
                    <Button type="Button" onClick={this.addComment}> Legg til kommentar</Button>
                </FormGroup>
            </div>
        }
        return(
            <Grid className="sak">
                <Col xs={12} md={4}>

          <h3>Beskrivelse</h3>
          <p>{this.state.issue.text}</p>

          <h3>Status</h3>
                    <ProgressBar>
                    <ProgressBar bsStyle={this.state.status.progressBar} active={this.state.status.inProgress} now={this.state.status.progress}
                                 label={this.state.status.name} style={{color: 'black'}}/>
                    </ProgressBar>

          <h3>Dato sendt inn</h3>
          <p>{this.state.issue.date}</p>

          <h3>Adresse</h3>
          <p>{this.state.issue.address}</p>

          <h3>Kategori</h3>
          <p>{this.Categories()}</p>

          <Image src={this.state.image} />

        </Col>

        <Row>
          <Col xsOffset={23} md={8}>
            {editStatus}
          </Col>
        </Row>
            <br/>
            <h3> <b>Kommentarer </b></h3>
                {renderComment}
                <br/>
                <Table condensed hover bordered>
                {this.state.issueComments.map(e => {
                    return(

                      <tbody key={e}>
                      <tr>
                          <td>
                              <Col>
                                  <h4> <b>{e.mail}</b></h4>
                                  <h4> <i>{e.text}</i></h4>
                              </Col>
                          </td>
                        </tr>
                      </tbody>
                  )
            })}
                </Table>
        <br/>
      </Grid>
    );
  }//end method


  componentWillMount() {
    issueService.getIssueAndCounty(this.props.match.params.issueId).then(response => {
      this.setState({ issue: response[0], categoryLevel: response[0].categoryLevel, image: response[0].pic });
      issueService.getCompanyComments(response[0].issueId).then(r => {
            this.setState({issueComments: r});
      }).catch((error: Error) => Alert.danger(error.message));

      if (response.statusName === 'Registered') this.setState({ editCase: true });
      else this.setState({ editCase: false });

      this.setState({ status: new Status(response[0].statusName) });

      //if the category is not instance of any subcategories
      if (this.state.categoryLevel === 1) {
        categoryService.getOneCategory1(this.state.issue.categoryId).then(r => {
          this.setState({ category1: r[0] });
        }).catch((error: Error) => Alert.danger(error.message));


        //if the category is a subcategory, fetch it with it's belonging main category
      } else if (this.state.categoryLevel === 2) {
        categoryService.getOneCategory2(this.state.issue.categoryId).then(r => {
          this.setState({ category2: r[0] });
          categoryService.getOneCategory1(r[0].categoryId).then(r2 => {
            this.setState({ category1: r2[0] });
          }).catch((error: Error) => Alert.danger(error.message));
        }).catch((error: Error) => Alert.danger(error.message));

      } else { //if it's a subcategory of a subcategory, fetch all levels.
        categoryService.getOneCategory3(this.state.issue.categoryId).then(r => {
          this.setState({ category3: r[0] });
          categoryService.getOneCategory2(r[0].category2Id).then(r2 => {
            this.setState({ category2: r2[0] });
            categoryService.getOneCategory1(r2[0].categoryId).then(r3 => {
              this.setState({ category1: r3[0] });
            }).catch((error: Error) => Alert.danger(error.message));
          }).catch((error: Error) => Alert.danger(error.message));
        }).catch((error: Error) => Alert.danger(error.message));
      }//end condition
    }).catch((error: Error) => Alert.danger(error.message));
  }//end method

  Categories() {
    if (this.state.categoryLevel === 1) {
      return (<p>{this.state.category1.name}</p>);
    } else if (this.state.categoryLevel === 2) {
      return (<p>{this.state.category1.name} - {this.state.category2.name}</p>);
    }//end condition
  }//end method



  showPic() {
    if (this.state.issue.pic !== null) {
      return <Image className="picture" src={this.state.issue.pic} rounded/>;
    }
  }//end method

    editComment = (event:SyntheticEvent<HTMLInputElement>) => {
        this.setState({comment: event.target.value});
    };//end method

    addComment = () => {
      issueService.addCommentToIssue(this.state.issue.issueId, this.state.comment,this.props.match.params.email).then(response => {
          window.location.reload();
      }).catch((error: Error) => Alert.danger(error.message));
    };

  setStatus = (event: Event) => {
    this.setState({ statusName: event.target.value });
  };//end method

  saveThisStatus = () => {
    issueService.updateStatusOneIssue(this.state.issue.issueId, this.state.statusName).then(response => {
    }).catch((error: Error) => Alert.danger(error.message));
    window.location.reload();
  };//end method
}//end class

