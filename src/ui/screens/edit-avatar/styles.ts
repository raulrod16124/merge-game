import styled from 'styled-components';

export const PreviewArea = styled.div`
  margin-top: 16px;
  width: 220px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  background: radial-gradient(
    circle,
    rgba(10, 0, 20, 0.75) 0%,
    rgba(10, 0, 20, 0.55) 60%,
    rgba(10, 0, 20, 0) 100%
  );

  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.6),
    0 0 90px rgba(60, 0, 90, 0.5);

  border-radius: 50%;
`;

export const VariantSelector = styled.div`
  margin: 0 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
