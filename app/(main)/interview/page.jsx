import { getAssessments } from "../../../actions/interview";
import QuizList from "../../../components/QuizList";
import StatsCard from "../../../components/StatsCard";
import PerformanceChart from "../../../components/PerformanceChart";

const InterviewPage = async () => {
  const assessments = await getAssessments();
  return (
    <div>
      <div>
        <h1 className={"text-6xl font-bold gradient-title mb-5"}>
          Interview Preparation
        </h1>

        <div className={"space-y-6"}>
          <StatsCard assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  );
};
export default InterviewPage;
