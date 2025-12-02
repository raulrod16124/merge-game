// src/common/Input.tsx
import styled from 'styled-components';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  styles?: React.CSSProperties;
}

const Wrapper = styled.div<{fullWidth?: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({fullWidth}) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-align: left;
`;

const StyledInput = styled.input<{hasError?: boolean}>`
  padding: 12px 14px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.08);
  border: 1px solid
    ${({hasError}) =>
      hasError ? 'rgba(255, 80, 80, 0.7)' : 'rgba(255, 255, 255, 0.18)'};

  font-size: 1rem;
  color: white;

  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({hasError}) =>
      hasError ? 'rgba(255, 100, 100, 0.9)' : '#ffb844'};
    box-shadow: 0 0 10px
      ${({hasError}) =>
        hasError ? 'rgba(255, 80, 80, 0.5)' : 'rgba(255, 184, 68, 0.35)'};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #ff6a6a;
  text-align: left;
`;

export function Input({
  label,
  error,
  fullWidth = true,
  styles,
  ...props
}: InputProps) {
  return (
    <Wrapper fullWidth={fullWidth} style={styles}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledInput hasError={Boolean(error)} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}

export default Input;
