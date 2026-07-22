import amlogic from "../assets/customer-logos/amlogic.png";
import bekaert from "../assets/customer-logos/bekaert.svg";
import beckmanCoulter from "../assets/customer-logos/beckman-coulter.svg";
import bloomage from "../assets/customer-logos/bloomage.png";
import booking from "../assets/customer-logos/booking.svg";
import bosch from "../assets/customer-logos/bosch.png";
import byHealth from "../assets/customer-logos/by-health.png";
import cartier from "../assets/customer-logos/cartier.svg";
import changshuBank from "../assets/customer-logos/changshu-bank.png";
import chewy from "../assets/customer-logos/chewy.svg";
import chinaamc from "../assets/customer-logos/chinaamc.png";
import chnEnergy from "../assets/customer-logos/chn-energy.svg";
import cicc from "../assets/customer-logos/cicc.svg";
import cepheid from "../assets/customer-logos/cepheid.svg";
import danaher from "../assets/customer-logos/danaher.svg";
import delphi from "../assets/customer-logos/delphi.svg";
import ecovacs from "../assets/customer-logos/ecovacs.svg";
import forvia from "../assets/customer-logos/forvia.png";
import fosunPharma from "../assets/customer-logos/fosun-pharma.png";
import fullgoalFund from "../assets/customer-logos/fullgoal-fund.png";
import gilead from "../assets/customer-logos/gilead.png";
import guolianMinsheng from "../assets/customer-logos/guolian-minsheng.png";
import haday from "../assets/customer-logos/haday.png";
import henlius from "../assets/customer-logos/henlius.png";
import huaanFunds from "../assets/customer-logos/huaan-funds.png";
import huawei from "../assets/customer-logos/huawei.svg";
import imgAcademy from "../assets/customer-logos/img-academy.png";
import innovent from "../assets/customer-logos/innovent.png";
import jiahuaChemicals from "../assets/customer-logos/jiahua-chemicals.png";
import manulifeSinochem from "../assets/customer-logos/manulife-sinochem.png";
import mcdonalds from "../assets/customer-logos/mcdonalds.svg";
import mevion from "../assets/customer-logos/mevion.png";
import mondelez from "../assets/customer-logos/mondelez.png";
import orange from "../assets/customer-logos/orange.svg";
import saintGobain from "../assets/customer-logos/saint-gobain.png";
import sennics from "../assets/customer-logos/sennics.png";
import shanghaiTower from "../assets/customer-logos/shanghai-tower.png";
import starbucks from "../assets/customer-logos/starbucks.svg";
import ubs from "../assets/customer-logos/ubs.svg";
import wuxiApptec from "../assets/customer-logos/wuxi-apptec.png";
import xinjiangBank from "../assets/customer-logos/xinjiang-bank.png";
import yuwell from "../assets/customer-logos/yuwell.png";

export interface CustomerLogo {
  name: string;
  src: string;
}

const firstRow: readonly CustomerLogo[] = [
  { name: "McDonald’s", src: mcdonalds },
  { name: "Booking.com", src: booking },
  { name: "Haday", src: haday },
  { name: "Saint-Gobain", src: saintGobain },
  { name: "Cartier", src: cartier },
  { name: "Delphi", src: delphi },
  { name: "HuaAn Funds", src: huaanFunds },
  { name: "CICC", src: cicc },
  { name: "Xinjiang Bank", src: xinjiangBank },
  { name: "Manulife-Sinochem", src: manulifeSinochem },
  { name: "Orange", src: orange },
  { name: "FORVIA", src: forvia },
  { name: "Yuwell", src: yuwell },
  { name: "WuXi AppTec", src: wuxiApptec },
  { name: "Mevion", src: mevion },
  { name: "Jiahua Chemicals", src: jiahuaChemicals },
  { name: "Beckman Coulter", src: beckmanCoulter },
  { name: "Danaher", src: danaher },
  { name: "Henlius", src: henlius },
  { name: "Sennics", src: sennics },
  { name: "Bosch", src: bosch },
];

const secondRow: readonly CustomerLogo[] = [
  { name: "Starbucks", src: starbucks },
  { name: "Mondelēz International", src: mondelez },
  { name: "Huawei", src: huawei },
  { name: "ECOVACS", src: ecovacs },
  { name: "Shanghai Tower", src: shanghaiTower },
  { name: "Chewy", src: chewy },
  { name: "Fullgoal Fund", src: fullgoalFund },
  { name: "ChinaAMC", src: chinaamc },
  { name: "Changshu Rural Commercial Bank", src: changshuBank },
  { name: "Guolian Minsheng Securities", src: guolianMinsheng },
  { name: "Bloomage", src: bloomage },
  { name: "IMG Academy", src: imgAcademy },
  { name: "Innovent", src: innovent },
  { name: "Fosun Pharma", src: fosunPharma },
  { name: "BY-HEALTH", src: byHealth },
  { name: "Amlogic", src: amlogic },
  { name: "Cepheid", src: cepheid },
  { name: "UBS", src: ubs },
  { name: "Gilead", src: gilead },
  { name: "CHN Energy", src: chnEnergy },
  { name: "Bekaert", src: bekaert },
];

export const customerLogoRows = [firstRow, secondRow] as const;
