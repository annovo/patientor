import React from "react";
import {
  Entry,
  Diagnosis,
  HospitalEntry,
  BaseEntry,
  HealthCheckEntry,
  HealthCheckRating,
  OccupationalHealthcareEntry,
} from "../types";
import { useStateValue } from "../state";
import { Grid, Icon, Segment, Label } from "semantic-ui-react";
import _ from "lodash";

const DiagnosisInfo: React.FC<{ code: Diagnosis["code"] }> = ({ code }) => {
  const [{ diagnosis }] = useStateValue();
  const currDiagnosis = _.find(diagnosis, (d) => d.code === code);

  if (!currDiagnosis) {
    return null;
  }
  return (
    <Segment color="red">
      {currDiagnosis.code} {currDiagnosis.name}
    </Segment>
  );
};

const BaseEntryContainer: React.FC<BaseEntry> = ({
  date,
  description,
  diagnosisCodes,
}) => (
  <Grid>
    <Grid.Column width={10}>
      <Segment>
        <p>
          <Icon name="stethoscope" />
          {description}
        </p>
      </Segment>
      {diagnosisCodes?.map((d, i) => (
        <DiagnosisInfo key={i} code={d} />
      ))}
    </Grid.Column>
    <Grid.Column width={5}>
      <Segment stacked>
        <strong>{date}</strong>
      </Segment>
    </Grid.Column>
  </Grid>
);

const HospitalEntryContainer: React.FC<HospitalEntry> = ({ discharge }) => (
  <Segment color="green">
    <p>Discharged: {discharge.date}</p>
    <p>Reason: {discharge.criteria}</p>
  </Segment>
);

const HealthCheckContainer: React.FC<HealthCheckEntry> = ({
  healthCheckRating,
}) => {
  let color: "green" | "yellow" | "orange" | "red" | undefined;

  switch (healthCheckRating) {
    case HealthCheckRating.Healthy:
      color = "green";
      break;
    case HealthCheckRating.LowRisk:
      color = "yellow";
      break;
    case HealthCheckRating.HighRisk:
      color = "orange";
      break;
    case HealthCheckRating.CriticalRisk:
      color = "red";
      break;
    default:
      color = undefined;
  }
  return (
    <div style={{ overflow: "auto", float: "right", paddingRight: 30 }}>
      <Label tag sixe="large">
        <Icon name="heart" color={color} />
      </Label>
    </div>
  );
};

const OccupationalHealthcareContainer: React.FC<OccupationalHealthcareEntry> = ({
  employerName,
  sickLeave,
}) => (
  <Segment color="purple">
    <p>Employer name: {employerName}</p>
    <p>
      Sick leave:{" "}
      <i>
        {sickLeave
          ? `${sickLeave.startDate} - ${sickLeave.endDate}`
          : "no sick leave"}
      </i>
    </p>
  </Segment>
);
const EntryInfo: React.FC<{ entry: Entry }> = ({ entry }) => {
  const entryType = () => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckContainer {...entry} />;
      case "Hospital":
        return <HospitalEntryContainer {...entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareContainer {...entry} />;
      default:
        return null;
    }
  };
  return (
    <Segment raised>
      <BaseEntryContainer {...entry} />
      {entryType()}
    </Segment>
  );
};

export default EntryInfo;
