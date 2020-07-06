import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue, initilizePatients, initilizeDiagnosis } from "./state";
import { Patient, Diagnosis } from "./types";

import PatientListPage from "./PatientListPage";
import PatientInfo from "./PatientInfo";

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);
    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(initilizePatients(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchDiagnosisArr = async () => {
      try {
        const { data: diagnosisArr } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(initilizeDiagnosis(diagnosisArr));
      } catch (e) {
        console.log(e);
      }
    };
    fetchDiagnosisArr();
    fetchPatientList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id" render={() => <PatientInfo />} />
            <Route path="/" render={() => <PatientListPage />} />
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
