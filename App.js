import React, { useState } from 'react';
import { Dropdown } from './Components/Select';
import { Textinput } from './Components/Input';
import { Button, Container, CssBaseline, Typography } from '@mui/material';
import { HfInference } from '@huggingface/inference';
import Header from './Components/Header';
import Example from './Components/Carousel';

const hf = new HfInference(process.env.REACT_HUGGINGFACE_API_READ_KEY);
//age, gender, fitness level, target muscle groups, and desired workout duration
function App() {
  const UserDetails = {
    Age: '',
    Gender: '',
    fitnessLevel: '',
    targetMuscleGroups: '',
    desiredWorkoutDuration: '',
  };
  const [answer, setAnswer] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    fetchAnswer();
    //console.log(UserDetails);
  };
  const updateDetails = (name, value) => {
    UserDetails[name] = value;
  };
  const fetchAnswer = async () => {
    const question = `I am of age ${UserDetails.Age}, ${UserDetails.Gender} and have a preference to gain ${UserDetails.targetMuscleGroups} muscle in 3 months, and my goal is to get max body weight as per BMI. My fitness is ${UserDetails.fitnessLevel} level and I plan to work out for ${UserDetails.desiredWorkoutDuration} every day. What is the best personalised workout plan for me?`;
    const response = await hf.textGeneration({
      model: 'tiiuae/falcon-7b-instruct',
      inputs: question,
      parameters: {
        max_new_tokens: 120,
        temperature: 1,
      },
    });
    console.log('resp is ', response);
    setAnswer(response.generated_text);
  };
  return (
    <>
      <CssBaseline />
      <Header />
      <main>
        <Example />
        <div>
          <Container>
            <Typography variant='h2'> Ready to Plan your workout? </Typography>
            <Textinput name='Age' details={updateDetails} />
            <Dropdown
              name='Gender'
              multiproperties={['None', 'male', 'female']}
              details={updateDetails}
            />
            <Dropdown
              name='desiredWorkoutDuration'
              multiproperties={[
                'very limited',
                '30 mins',
                '60 mins',
                '75 mins',
                '90 mins',
              ]}
              details={updateDetails}
            />
            <Dropdown
              name='targetMuscleGroups'
              multiproperties={[
                'None',
                'chest',
                'legs',
                'core',
                'cardio',
                'biceps',
              ]}
              details={updateDetails}
            />
            <Dropdown
              name='fitnessLevel'
              multiproperties={[
                'None',
                'beginner',
                'intermediate',
                'professional',
              ]}
              details={updateDetails}
            />
            <Button variant='contained' type='submit' onClick={handleSubmit}>
              Submit
            </Button>
            {answer && <p>Answer is: {answer}</p>}
          </Container>
        </div>
      </main>
    </>
  );
}

export default App;
