import { useParams } from 'react-router-dom';
import StackChoiceView from '@/features/projects/components/StackChoiceView';

const StackChoicePage = () => {
    const { id } = useParams();

    return (
        <StackChoiceView projectId={id} />
    );
};

export default StackChoicePage;
