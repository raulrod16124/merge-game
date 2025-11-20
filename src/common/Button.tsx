// src/commons/Button.tsx
import React from 'react';
import styled, {css} from 'styled-components';
import {Link} from 'react-router-dom';
import {COLORS} from '../ui/constants';

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

const planetYellow = COLORS.primary;
const planetYellowDark = COLORS.primaryDark;

const ringPurple = COLORS.secondary;
const ringPurpleDark = COLORS.secondaryDark;

const grayDark = COLORS.tertiary;
const grayMedium = COLORS.tertiaryDark;

const greenSuccess = COLORS.success;
const greenSuccessDark = COLORS.successDark;

const redFail = COLORS.fail;
const redFailDark = COLORS.failDark;

const variantStyles = {
  primary: css`
    background: linear-gradient(180deg, ${planetYellow}, ${planetYellowDark});
    color: #2b1a00;
  `,
  secondary: css`
    background: linear-gradient(180deg, ${ringPurple}, ${ringPurpleDark});
    color: white;
  `,
  tertiary: css`
    background: linear-gradient(180deg, ${grayMedium}, ${grayDark});
    color: #e6e6f5;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  `,
  success: css`
    background: linear-gradient(180deg, ${greenSuccess}, ${greenSuccessDark});
    color: #00300f;
  `,
  fail: css`
    background: linear-gradient(180deg, ${redFail}, ${redFailDark});
    color: #300000;
  `,
};

const BaseButton = styled.button<{
  variant: ButtonVariant;
  fullWidth?: boolean;
}>`
  padding: 12px 0;
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

  ${({fullWidth}) => (fullWidth ? 'padding: 12px 0;' : 'padding: 12px 16px;')}

  ${({fullWidth}) => (fullWidth ? 'width: 100%;' : 'width: auto;')}

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
