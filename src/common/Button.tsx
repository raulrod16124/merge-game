// src/commons/Button.tsx
import React from 'react';
import styled, {css} from 'styled-components';
import {Link} from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'success' | 'fail';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

const planetYellow = '#ffb844';
const planetYellowDark = '#e89227';

const ringPurple = '#7b4dff';
const ringPurpleDark = '#5a2fd4';

const grayDark = '#1a1a23';
const grayMedium = '#2a2a35';

const greenSuccess = '#4cd964';
const greenSuccessDark = '#33b84b';

const redFail = '#ff5c5c';
const redFailDark = '#db3838';

const variantStyles = {
  primary: css`
    background: linear-gradient(180deg, ${planetYellow}, ${planetYellowDark});
    color: #2b1a00;
  `,
  secondary: css`
    background: linear-gradient(180deg, ${ringPurple}, ${ringPurpleDark});
    color: white;
    box-shadow: 0 6px 16px rgba(123, 77, 255, 0.32);
  `,
  tertiary: css`
    background: linear-gradient(180deg, ${grayMedium}, ${grayDark});
    color: #e6e6f5;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  `,
  success: css`
    background: linear-gradient(180deg, ${greenSuccess}, ${greenSuccessDark});
    color: #00300f;
    box-shadow: 0 6px 16px rgba(76, 217, 100, 0.32);
  `,
  fail: css`
    background: linear-gradient(180deg, ${redFail}, ${redFailDark});
    color: #300000;
    box-shadow: 0 6px 16px rgba(255, 92, 92, 0.35);
  `,
};

const BaseButton = styled.button<{
  variant: ButtonVariant;
  fullWidth?: boolean;
}>`
  padding: 12px 20px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 800;
  transition: 0.15s ease-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;

  ${({fullWidth}) => fullWidth && 'width: 100%;'}

  ${({variant}) => variantStyles[variant]}

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export function Button({
  children,
  variant = 'primary',
  to,
  onClick,
  disabled,
  fullWidth,
  loading,
  className,
  styles,
}: ButtonProps) {
  const content = loading ? 'Cargando...' : children;

  if (to) {
    return (
      <BaseButton
        as={Link}
        to={to}
        variant={variant}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className}
        style={styles}>
        {content}
      </BaseButton>
    );
  }

  return (
    <BaseButton
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      className={className}
      style={styles}>
      {content}
    </BaseButton>
  );
}
