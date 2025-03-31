declare module 'redux-persist/integration/react' {
    import { Store } from 'redux';
    import { Persistor } from 'redux-persist';
    import { ReactNode } from 'react';

    interface PersistGateProps {
        persistor: Persistor;
        children: ReactNode;
        loading?: ReactNode;
        onBeforeLift?: () => void;
    }

    export class PersistGate extends React.Component<PersistGateProps> {}
} 