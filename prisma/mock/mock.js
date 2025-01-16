<<<<<<< Updated upstream
=======
import { Area, NotificationType, Progress, ServiceType, Status } from '@prisma/client';

export const serviceType = Object.values(ServiceType);
export const areas = Object.values(Area);
export const status = Object.values(Status);
export const progress = Object.values(Progress);
export const notificationTypes = Object.values(NotificationType);
export const addresses = [
  '서울 강남구 테헤란로 123',
  '경기 성남시 분당구 판교로 45',
  '인천 연수구 송도국제대로 78',
  '강원 춘천시 퇴계로 90',
  '충북 청주시 상당구 상당로 55',
  '충남 천안시 서북구 서부대로 111',
  '세종 나성동 세종로 100',
  '대전 서구 둔산대로 234',
  '전북 전주시 완산구 백제대로 88',
  '전남 여수시 이순신로 77',
  '광주 서구 치평로 101',
  '경북 구미시 산업로 150',
  '경남 창원시 성산구 원이대로 250',
  '대구 중구 동성로 56',
  '울산 남구 삼산로 70',
  '부산 해운대구 우동로 44',
  '제주 제주시 신대로 22',
  '서울 중구 세종대로 89',
  '경기 용인시 기흥구 용구대로 567',
  '인천 서구 가정로 120',
  '강원 강릉시 경강로 345',
  '충북 제천시 의림대로 78',
  '충남 아산시 온천대로 134',
  '세종 도담동 한누리대로 56',
  '대전 동구 중앙로 112',
  '전북 군산시 조촌로 210',
  '전남 순천시 왕지로 99',
  '광주 북구 문화로 250',
  '경북 포항시 남구 중앙로 500',
  '경남 진주시 진주대로 301',
  '대구 달서구 월배로 89',
  '울산 북구 산업로 145',
  '부산 수영구 광안로 66',
  '제주 서귀포시 중문로 33',
  '서울 송파구 올림픽로 101',
  '경기 고양시 일산서구 중앙로 333',
  '인천 남동구 인주대로 222',
  '강원 원주시 봉화로 90',
  '충북 음성군 음성로 88',
  '충남 공주시 웅진로 45',
  '세종 새롬동 새롬로 67',
  '대전 유성구 대학로 123',
  '전북 익산시 무왕로 234',
  '전남 목포시 평화로 99',
  '광주 동구 금남로 77',
  '경북 안동시 문화로 121',
  '경남 김해시 가야로 345',
  '대구 수성구 달구벌대로 78',
  '울산 중구 태화로 50',
  '부산 동래구 충렬대로 67',
];
export const introduces = [
  '안녕하세요, 믿을 수 있는 이삿짐 센터 기사입니다. 안전하고 빠른 이사를 도와드리겠습니다!',
  '고객님의 소중한 짐, 안전하게 옮기는 것이 제 일입니다. 친절하고 신속한 서비스 약속드립니다!',
  '정확하고 빠른 이사로 고객님께 편안함을 드리는 이삿짐 기사입니다!',
  '안전한 이사, 정직한 서비스! 믿고 맡겨 주세요.',
  '다년간의 경험을 바탕으로, 이사를 원활하게 진행해드립니다!',
  '이사만큼 중요한 일이 없다고 생각합니다. 고객님의 짐을 안전하게 운반합니다!',
  '이사 도중 발생할 수 있는 모든 상황을 빠르게 대처하는 이삿짐 기사입니다!',
  '고객님의 짐을 내 집처럼 소중히 여기며 이사합니다. 항상 친절하게 대응하겠습니다!',
  '편리하고 안전한 이사, 믿고 맡겨 주세요. 빠르고 정확하게 이사 진행하겠습니다!',
  '수많은 이사 경험을 통해 얻은 노하우로 고객님께 만족을 드리겠습니다!',
  '이사를 돕는 동안 늘 신속하고 안전하게 처리해드릴 것을 약속드립니다!',
  '손님처럼 대접받으며, 고객님의 짐을 소중히 옮깁니다. 안전한 이사, 확실히 진행합니다!',
  '가장 중요한 것은 고객님의 짐입니다. 안전하고 빠른 이사를 보장합니다!',
  '이사 전문 기사로서, 정직하고 성실하게 서비스를 제공합니다!',
  '이사라는 일이 얼마나 중요한지 잘 알고 있습니다. 정성을 다해 이사합니다.',
  '이사는 저에게 맡기세요. 정해진 시간에 정확히, 안전하게 이사하겠습니다!',
  '빠르고 안전한 이사, 고객님께 만족을 드리는 것이 제 목표입니다!',
  '이삿짐 센터의 기사로서, 모든 짐을 신속하고 안전하게 옮기겠습니다!',
  '고객님의 이사, 저에게 맡겨주시면 후회하지 않으실 겁니다. 신속하고 안전하게 처리합니다!',
  '이사 전 과정에서 세심하게 신경쓰며, 안전하고 효율적으로 짐을 옮기겠습니다!',
];
export const driverDescriptions = [
  '저는 고객님의 소중한 짐을 안전하고 신속하게 옮기는 데 최선을 다합니다. 어떤 물품도 안전하게 운반할 수 있도록 꼼꼼히 준비하고, 이동 중 손상이 없도록 철저히 관리합니다.',
  '고객님의 요구에 맞춘 맞춤형 이사를 제공하며, 다양한 물품을 효율적으로 처리할 수 있는 경험을 갖추고 있습니다. 친절하고 신속하게 서비스를 제공하여 이사를 원활하게 돕겠습니다.',
  '고객님의 짐을 소중하게 다루며, 모든 물품을 안전하게 이동시킵니다. 빠르고 정확하게 이사를 진행하며, 고객님께서 불편함 없이 이사를 마칠 수 있도록 최선을 다하겠습니다.',
  '저는 이사 중 발생할 수 있는 다양한 상황에 신속하게 대응하고, 고객님의 짐을 안전하게 옮기기 위해 철저히 준비합니다. 모든 물품을 꼼꼼하게 포장하여 손상 없이 이동시킵니다.',
  '저는 이사라는 일이 얼마나 중요한지 잘 알고 있습니다. 고객님의 짐을 신중하게 다루며, 불필요한 지체 없이 빠르고 정확하게 이사를 완료합니다. 언제나 고객님의 만족을 우선으로 생각합니다.',
  '이삿짐을 다룰 때 가장 중요한 것은 안전입니다. 고객님의 가전 제품부터 가구까지 모든 짐을 안전하게 운반하고, 시간이 지체되지 않도록 효율적으로 작업을 진행합니다.',
  '저는 이사 과정에서 고객님의 불편을 최소화하는 것을 목표로 합니다. 신속하게 짐을 옮기고, 필요시 짐을 포장하는 서비스까지 제공하여, 고객님의 이사를 보다 편리하게 돕겠습니다.',
  '이사는 단순한 물건 이동이 아닙니다. 고객님의 소중한 물건을 안전하게 다루기 위해 항상 신중하고 정확하게 이사 작업을 진행합니다. 빠르고 편리한 이사를 제공하여 만족을 드립니다.',
  '저는 고객님의 짐을 최우선으로 생각하며, 언제나 안전하고 빠른 이사를 진행합니다. 다양한 물품을 다룰 수 있는 경험을 바탕으로, 이사 과정에서 발생할 수 있는 모든 상황에 대처할 수 있습니다.',
  '이사 과정에서 고객님이 걱정하지 않도록, 친절하고 안전하게 짐을 운반합니다. 이동 중 짐의 손상을 방지하기 위해 모든 물품을 세심하게 포장하고, 빠르고 정확한 이사를 제공합니다.',
  '고객님의 짐을 다룰 때는 항상 조심스럽고 세심하게 처리합니다. 물품의 크기와 특성에 맞는 방법으로 이사를 진행하며, 이사 후에도 정리와 청소가 필요하다면 함께 도와드립니다.',
  '빠르고 안전한 이사를 보장합니다. 고객님의 짐을 소중히 다루며, 이사 중 발생할 수 있는 모든 상황을 예측하고 해결할 수 있습니다. 고객님께 만족스러운 서비스를 제공하는 것이 제 목표입니다.',
  '어떤 이사든 걱정 없이 맡길 수 있는 이삿짐 기사입니다. 짐을 안전하게 이동시키고, 고객님의 시간에 맞춰 신속하게 이사를 완료하는 것을 우선으로 생각합니다.',
  '이사는 체계적인 준비가 중요합니다. 고객님의 짐을 철저히 준비하고, 안전하게 옮기는 것에 집중하여, 불필요한 시간 낭비 없이 원활한 이사를 제공합니다.',
  '고객님의 물건을 손상 없이 이동시키기 위해 모든 절차에 신경을 씁니다. 이동 중 사고가 없도록 주의를 기울이며, 고객님이 만족할 수 있도록 최선을 다하겠습니다.',
  '이삿짐 센터에서 제공하는 최상의 서비스를 제공하기 위해 항상 안전하고 신속하게 이사를 진행합니다. 고객님의 물건을 신중하게 다루며, 언제나 최상의 상태로 이사를 마칩니다.',
  '저는 고객님의 이사를 원활하게 돕기 위해 항상 최선을 다합니다. 빠르고 정확한 작업으로 이사 시간을 단축시키고, 안전하게 짐을 옮길 수 있도록 최상의 방법을 선택합니다.',
  '고객님의 소중한 물건을 안전하게 다루기 위해 항상 세심하게 신경 쓰며 이사합니다. 이사 중 손상이 없도록 짐을 꼼꼼하게 포장하고, 빠르고 효율적인 서비스를 제공합니다.',
  '저는 항상 고객님의 입장에서 생각하고, 이사 중 불편을 최소화하기 위해 노력합니다. 고객님의 물건을 안전하게 옮기고, 최적의 방법으로 이사를 마무리하겠습니다.',
  '모든 이사 과정에서 고객님이 걱정하지 않도록 최선을 다하고 있습니다. 짐을 안전하고 빠르게 이동시키며, 친절한 서비스를 제공하여 이사 후에도 만족하실 수 있도록 돕겠습니다.',
];
export const estimationComments = [
  '고객님의 이사를 빠르고 안전하게 도와드리겠습니다. 언제든지 문의 주세요!',
  '이사 준비가 잘 되셨다면, 바로 진행하실 수 있도록 돕겠습니다.',
  '최고의 서비스를 제공하겠습니다. 이사 일정에 맞춰 신속하게 준비하겠습니다.',
  '이사 견적을 보내드렸습니다. 궁금한 점 있으시면 언제든지 연락 주세요!',
  '고객님의 이사를 더욱 편리하게 만들어드리겠습니다. 언제든지 도와드리겠습니다!',
  '이사에 필요한 모든 것을 고려한 견적입니다. 문의사항이 있으면 알려주세요!',
  '편안하고 안전한 이사, 고객님을 위해 최선을 다하겠습니다!',
  '이사 과정에서 궁금한 점이나 추가 요청 사항이 있으시면 언제든지 말씀 주세요!',
  '견적을 검토하신 후, 진행 여부를 알려주시면 빠르게 준비하겠습니다.',
  '빠르고 안전하게 이사를 도와드리겠습니다. 언제든지 문의 주세요!',
  '이사 날짜와 내용에 맞춰 최적의 견적을 보내드렸습니다. 확인 부탁드립니다.',
  '편리하고 효율적인 이사를 위해 언제든지 상담을 도와드리겠습니다.',
  '이사 진행을 위한 추가 문의 사항이 있으면 언제든지 연락 주세요!',
  '고객님의 이사 준비를 도와드리기 위해 최선을 다하겠습니다. 궁금한 점은 언제든지 알려주세요.',
  '편리하고 안전한 이사를 약속드립니다. 진행에 대해 확인해 주세요!',
  '이사 일정을 맞추기 위해 최선을 다하겠습니다. 언제든지 연락 주세요!',
  '이사 과정에 대한 자세한 설명이 필요하시면 언제든지 문의 주세요.',
  '안전하고 신속한 이사를 위해 꼼꼼하게 준비하겠습니다. 추가로 궁금한 점은 언제든지 말씀 주세요.',
  '이사에 필요한 모든 사항을 고려한 견적입니다. 검토 후 연락 부탁드립니다.',
  '편리한 이사를 위해 친절히 도와드리겠습니다. 언제든지 추가 문의 주세요!',
  '이사 진행에 대한 세부 사항은 언제든지 문의 주시면 설명드리겠습니다.',
  '고객님의 일정에 맞춰 신속하게 진행할 수 있도록 준비하겠습니다.',
  '이사 진행을 위한 최적의 계획을 준비했습니다. 문의사항은 언제든지 연락 주세요!',
  '빠르고 정확하게 이사를 도와드리겠습니다. 확인 후 편하신 시간에 알려주세요.',
  '이사 준비가 잘 되셨다면 언제든지 진행해드리겠습니다. 문의 사항 있으시면 연락 주세요!',
  '이사에 필요한 모든 사항을 고려한 견적을 보내드렸습니다. 빠르게 확인해 주세요.',
  '이사 일정에 맞춰 최선을 다해 준비하겠습니다. 궁금한 점 있으시면 언제든지 연락 주세요!',
  '편안하고 안전한 이사를 위해 항상 최선을 다하겠습니다. 언제든지 문의 주세요!',
  '이사 일정과 내용을 확인해주시면 빠르게 진행할 수 있도록 준비하겠습니다.',
  '이사 진행을 위한 세부 사항은 언제든지 문의해 주세요. 최적의 서비스를 제공하겠습니다.',
];
export const questionContents = [
  '견적에 포함된 서비스 내용은 어떤 것들이 있나요?',
  '추가 비용이 발생할 가능성은 없나요?',
  '이사 날짜와 시간에 맞춰 정확하게 이사가 가능한가요?',
  '이사 전에 준비해야 할 특별한 사항은 무엇인가요?',
  '짐을 포장하는 서비스는 추가 비용이 드나요?',
  '가전 제품이나 대형 가구의 안전한 운반 방법은 어떻게 되나요?',
  '짐을 포장하는 데 시간이 얼마나 걸리나요?',
  '이사 진행 중에 추가적으로 비용이 발생하는 경우가 있을까요?',
  '견적에 포함된 거리 외에 추가 요금이 발생하는지 궁금합니다.',
  '이사 날짜 변경 시 추가 비용이 발생하는지 확인하고 싶습니다.',
  '짐을 옮기기 전에 미리 포장을 해야 하는데, 포장 서비스가 포함되어 있나요?',
  '이사 후 남은 물건에 대해서도 처리해 주실 수 있나요?',
  '가전 제품을 안전하게 옮기기 위한 특별한 장비나 방법이 있나요?',
  '이사할 집의 엘리베이터가 고장 났을 경우 어떻게 되나요?',
  '집에 주차 공간이 없을 경우 어떻게 해야 하나요?',
  '이사 전에 짐을 미리 보관할 수 있는 서비스가 있나요?',
  '침대나 책상 등의 대형 가구는 분해해서 옮길 수 있나요?',
  '이사 후 청소 서비스도 포함되어 있는지 궁금합니다.',
  '이사할 때 짐의 일부만 운반할 수도 있나요?',
  '이사를 빨리 끝내기 위해 시간을 단축할 수 있는 방법이 있을까요?',
];
export const reviewContents = [
  '짐이 손상된 채로 도착해서 많이 실망했습니다.',
  '이사 시간이 예정보다 너무 오래 걸려 불편했습니다.',
  '기사님의 태도가 불친절해서 기분이 좋지 않았습니다.',
  '짐을 옮기다 실수로 물건을 놓고 가는 바람에 다시 보내야 했습니다.',
  '이사 준비가 미흡해서 예상보다 많은 문제가 생겼습니다.',
  '이사는 무사히 끝났지만, 속도나 서비스가 아쉬웠습니다.',
  '기사님은 친절했지만, 일부 짐에 손상이 생겨 아쉬웠습니다.',
  '이사 과정은 괜찮았지만, 몇 가지 세부사항이 부족해 보였습니다.',
  '짐은 잘 옮겨졌으나, 예상보다 더 많은 시간이 걸렸습니다.',
  '서비스는 괜찮았지만, 포장에 대한 추가 안내가 필요했습니다.',
  '전반적으로 괜찮았지만, 이사 중간에 약간의 혼란이 있었습니다.',
  '이사 과정은 원활했으나, 추가 비용이 예상보다 많이 나왔습니다.',
  '친절하게 서비스해 주셨지만, 몇 가지 불편한 점이 있었습니다.',
  '전반적으로 무난했지만, 추가적인 정리가 필요했어요.',
  '이사 준비 과정이 조금 더 철저했으면 좋았을 것 같습니다.',
  '짐을 안전하게 옮겨 주셔서 정말 만족스럽습니다.',
  '빠르고 정확한 이사로 기분 좋게 마무리할 수 있었습니다.',
  '친절하고 전문적인 서비스로 이사 과정이 훨씬 쉬웠습니다.',
  '예상보다 빨리 이사를 마쳐서 정말 만족스럽습니다.',
  '기다린 시간이 짧고, 모든 물건이 손상 없이 잘 옮겨졌습니다.',
  '친절하고 세심한 서비스 덕분에 이사가 편하게 진행되었습니다.',
  '이사 중 특별한 문제가 없었고, 만족스럽게 마무리되었습니다.',
  '기사를 맡은 분들이 매우 친절했고, 전체적으로 만족스러웠습니다.',
  '이사 진행 중 모든 과정이 원활하게 진행되어 매우 좋았습니다.',
  '빠르고 안전한 이사를 해 주셔서 매우 만족합니다.',
  '짐을 꼼꼼하게 다뤄 주셔서 매우 신뢰할 수 있었습니다.',
  '예상 시간보다 빨리 이사를 끝냈고, 만족스러운 결과였습니다.',
  '이사 준비부터 끝까지 꼼꼼히 챙겨주셔서 감사합니다.',
  '전반적으로 만족스러운 서비스였고, 추가로 필요한 부분도 잘 해결되었습니다.',
  '친절하고 능숙한 기사님 덕분에 이사 후에도 기분이 좋았습니다.',
];
>>>>>>> Stashed changes
