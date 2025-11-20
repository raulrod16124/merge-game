import {AppLayout} from '@/ui/layout/AppLayout';
import styled from 'styled-components';
import {COLORS} from '@/ui/constants';
import {useUserStore} from '@/state/user-store';

const Box = styled.div`
  padding: 24px;
  text-align: center;

  .avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: ${COLORS.tertiaryDark};
    color: ${COLORS.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    border-radius: 50%;
  }

  p {
    margin-top: 12px;
    opacity: 0.9;
    font-size: 1.2rem;
  }
`;

export default function Profile() {
  const {avatar, name} = useUserStore();

  return (
    <AppLayout title="Perfil">
      <Box>
        <div className="avatar">{avatar}</div>
        <p>{name}</p>
      </Box>
    </AppLayout>
  );
}
