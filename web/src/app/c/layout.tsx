import { HomeNavbar } from '@/components/home/navbar';

interface Props {
    children: React.ReactNode;
}

const ConversationLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <HomeNavbar />
            <main className="flex-1 py-6">{children}</main>
        </div>
    );
};

export default ConversationLayout;
