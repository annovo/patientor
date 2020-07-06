import React, { useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import {
  Patient,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  BaseEntry,
  EntriesType
} from "../types";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { updatePatientInfo } from "../state/reducer";
import _ from "lodash";
import { Icon, Divider, Button } from "semantic-ui-react";
import EntryInfo from "./DiagnosisInfo";
import { BaseEntryForm } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

enum IconName {
  male = "mars",
  female = "venus",
  other = "neuter",
}

const PatientInfoContainer: React.FC<Patient> = ({
  name,
  ssn,
  occupation,
  gender,
  entries,
}) => (
  <div>
    <h2>
      {name}
      <Icon name={IconName[gender]} />
    </h2>
    <p>ssn: {ssn}</p>
    <p>occupation: {occupation}</p>
    <h3>entries</h3>
    {entries?.map((e) => (
      <div key={e.id}>
        <EntryInfo entry={e} />
        <Divider section />
      </div>
    ))}
  </div>
);

const PatientInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const toNewEntry = (values: BaseEntryForm) => {
    let baseEntry: Omit<BaseEntry, "id"> = {
      date: values.date,
      description: values.description,
      specialist: values.specialist,
    };
    if (values.diagnosisCodes) {
      baseEntry = { ...baseEntry, diagnosisCodes: values.diagnosisCodes };
    }
    let newEntry:
      | Omit<HospitalEntry, "id">
      | Omit<HealthCheckEntry, "id">
      | Omit<OccupationalHealthcareEntry, "id">;
    switch (values.type) {
      case EntriesType.Hospital:
        return newEntry = {
          ...baseEntry,
          type: EntriesType.Hospital,
          discharge: values.discharge,
        };
      case EntriesType.HealthCheck:
        return newEntry = {
          ...baseEntry,
          type: EntriesType.HealthCheck,
          healthCheckRating: values.healthCheckRating,
        };
      case EntriesType.OccupationalHealthcare:
        newEntry = {
          ...baseEntry,
          type: EntriesType.OccupationalHealthcare,
          employerName: values.employerName,
        };
        if (values.sickLeave.startDate || values.sickLeave.endDate) {
         return newEntry = { ...newEntry, sickLeave: values.sickLeave };
        } else {
          return newEntry;
        }
      default:
        return newEntry = {
          ...baseEntry,
          type: EntriesType.Hospital,
          discharge: values.discharge,
        };
    }
  };

  const submitNewEntry = async (values: BaseEntryForm) => {
    try {
      const newEntry = toNewEntry(values);
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        newEntry
      );
      dispatch(updatePatientInfo(newPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data);
      console.log(error);
    }
  };

  useEffect(() => {
    const getPatientInfo = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatientInfo(patient));
      } catch (e) {
        console.error(e);
      }
    };
    if (_.isEmpty(patients[id]?.ssn)) {
      getPatientInfo();
    }
  }, [dispatch, id, patients]);

  return (
    <div>
      {_.map(patients, (p) => {
        if (p.id === id) {
          return <PatientInfoContainer key={p.id} {...p} />;
        }
      })}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientInfo;
