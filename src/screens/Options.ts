import RobotIcon from '../../asserts/preferencesImages/robot.svg';
import NewsPoliticsIcon from '../../asserts/preferencesImages/news-politics.svg';
import FootballIcon from '../../asserts/preferencesImages/football.svg';
import CinemaIcon from '../../asserts/preferencesImages/cinema.svg';
import GraduationIcon from '../../asserts/preferencesImages/graduation.svg';
import ChillPillsIcon from '../../asserts/preferencesImages/Group.svg';
import Vector from '../../asserts/preferencesImages/Vector.svg';
import Check from '../../asserts/preferencesImages/check.svg';

export interface Option {
  name: string;
  icon: any;
}

export const options: Option[] = [
  { name: 'Tech Trails', icon: RobotIcon },
  {  name: 'Political Scene', icon: NewsPoliticsIcon },
  {  name: 'Sport Sphere', icon: FootballIcon },
  {  name: 'Movie Mania', icon: CinemaIcon },
  {  name: 'Career Compass', icon: GraduationIcon },
  {  name: 'Chill Pills', icon: ChillPillsIcon },
];

export { Vector, Check };