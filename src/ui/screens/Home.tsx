// src/ui/screens/Home.tsx
import {Link} from 'react-router-dom';
import {
  HomeWrapper,
  Title,
  ContentArea,
  Card,
  Illustration,
  Description,
  PrimaryButton,
  FooterInfo,
} from './Home.styled';

export function Home() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />

      <HomeWrapper>
        <ContentArea>
          <Title>Merge Game</Title>

          <Card>
            <Illustration>🌳</Illustration>

            <Description>
              Combina elementos, crea estructuras nuevas y evita a los osos.
              ¡Selecciona un nivel y comienza la aventura!
            </Description>

            <Link to="/levels" style={{width: '100%'}}>
              <PrimaryButton>Comenzar →</PrimaryButton>
            </Link>
          </Card>

          <FooterInfo>v1.0</FooterInfo>
        </ContentArea>
      </HomeWrapper>
    </>
  );
}
