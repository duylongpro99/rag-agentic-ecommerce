interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return <div className="flex flex-col gap-y-4 justify-center items-center">{children}</div>;
};

export default HomeLayout;
