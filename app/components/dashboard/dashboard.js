import React from 'react';
import  Banner  from '../banner/banner';
// import CounterSection from '../home-content/counter-section';
import { withTranslation,i18n } from '../../../i18n';

class Dashboard extends React.Component {
    static getInitialProps = async ({ req }) => {
        const currentLanguage = req ? req.language : i18n.language;
    
        return { currentLanguage, namespacesRequired: ["common"] };
      };
    constructor(props) {
        super(props)
        
    }
    componentDidMount(){
        document.body.classList.add('hide-header-search');
    }
    componentWillUnmount(){
        document.body.classList.remove('hide-header-search');
    }
    render() {
        return (
            <div className="careerfy-wrapper">
                <Banner></Banner>
                <div className="careerfy-main-content">
                    {/* <CounterSection></CounterSection> */}
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Dashboard);
