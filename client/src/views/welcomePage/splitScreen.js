// @flow

import React from 'react';
import css from './splitScreen.css';


interface State {
}//end interface

interface Props {
}

export class splitScreen extends React.Component<Props, State> {

  state = {};


  render() {
    return (

      <section className="intro backgroundImage">
        <row>
          <a href={'/#/registrer/privat'}>
            <div className="col-lg-6 col-sm-12 left">
              <p> Privatperson </p>
            </div>
          </a>
          <a href={'/#/registrer/bedrift'}>
            <div className="col-lg-6 col-sm-12 right">
              <p> Bedrift </p>
            </div>
          </a>
        </row>
      </section>

    )
      ;
  }//end method
}