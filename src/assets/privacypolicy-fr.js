const privacy = `# Politique de confidentialité

StopCOVID a été conçue avec comme priorité absolue la protection de la vie privée des utilisateurs. Nous devons trouver un équilibre entre la protection de la santé publique et la protection de la vie privée, et StopCOVID adopte une approche qui privilégie cette dernière. L’application StopCOVID est conçue pour qu’il soit le plus difficile possible pour StopCOVID ou d’autres entités d’associer les informations que vous choisissez de fournir à vous ou à votre appareil : elle utilise ces renseignements uniquement pour permettre la notification d’exposition au virus dans le cadre de cette pandémie sans précédent.

## Quels renseignements utilisons-nous?
En accord avec l’[approche](https://www.apple.com/covid19/contacttracing) de Google et d’Apple, StopCOVID est conçue pour collecter et utiliser le moins de renseignements personnels possible afin de permettre la notification d’exposition au virus. StopCOVID ne recueille ni n’utilise aucune information permettant d’identifier une personne, à l’exception de ce qui suit :
- Identifiants aléatoires (également appelés « identificateurs de proximité en continu »)
  * Ces identifiants rotatifs sont partagés par Bluetooth entre les utilisateurs qui ont installé l’application sur leurs appareils et qui se trouvent à proximité. Ce processus est géré par votre appareil, et non par StopCOVID.
  * Ces identifiants sont générés et stockés sur votre appareil, et non par StopCOVID. Ils sont utilisés uniquement pour permettre à StopCOVID et à votre appareil de vérifier l’exposition au virus lorsque vous ou quelqu’un d’autre téléversez une clé d’exposition temporaire.
- Clés d’exposition temporaire (également appelées clés de diagnostic)
  * Si vous recevez un résultat de test positif, vous recevez une clé d’exposition temporaire que vous pouvez téléverser et partager avec tous les utilisateurs de l’application, uniquement si vous décidez de le faire. Vous avez le contrôle total de la décision de téléverser ou non la clé d’exposition temporaire.
  * StopCOVID conserve votre clé d’exposition temporaire pendant 30 jours ou moins.
  * Les autres utilisateurs peuvent ensuite utiliser StopCOVID pour déterminer si les identifiants aléatoires avec lesquels leur appareil est entré en contact sont associés à une clé d’exposition temporaire (donc, s’ils ont pu entrer en contact avec une personne infectée).
- Journaux d’utilisation des applications
  * Comme presque tous les services Internet ou applications, StopCOVID génère automatiquement des journaux lorsque vous utilisez le service. Ces journaux contiennent certaines informations sur votre appareil, que nous utilisons pour résoudre les problèmes survenant avec StopCOVID.
  * Ces journaux ne comprennent PAS d’identifiants aléatoires ni de clés d’exposition temporaire et ne peuvent pas être utilisés pour associer un identifiant de proximité mobile ou une clé d’exposition temporaire à vous ou à votre appareil.
  * Ces journaux sont automatiquement supprimés sept jours après leur création.
StopCOVID ne collecte pas les données de localisation de votre appareil. Elle ne recueille pas ni ne partage aucun renseignement permettant de vous associer, vous ou votre appareil, aux identifiants aléatoires ou aux clés d’exposition temporaire que vous générez.

## Quand partageons-nous vos renseignements?
Nous ne partageons volontairement aucun de vos renseignements personnels avec qui que ce soit, sauf dans les situations suivantes :
- Lorsque vous choisissez de téléverser une clé d’exposition temporaire, StopCOVID partage ces renseignements (qui ne peuvent pas être associés à vous par une personne n’ayant pas accès à votre appareil) avec d’autres appareils qui ont été en contact avec votre appareil, comme l’explique le [cadre de notification d’exposition](https://www.apple.com/covid19/contacttracing) de Google et d’Apple.
- Nous stockons vos renseignements personnels sous forme cryptée à l’aide d’Amazon Web Services. Amazon Web Services peut stocker ces renseignements à l’extérieur du Canada, y compris aux États-Unis.

## Comment protégeons-nous vos renseignements?
StopCOVID protège les clés d’exposition temporaire à l’aide du [cadre de notification d’exposition](https://www.apple.com/covid19/contacttracing) de Google et d’Apple, qui comprend des exigences très spécifiques quant à la manière dont ces informations doivent être cryptées et transférées. StopCOVID ne stocke pas ni ne génère vos identifiants aléatoires, qui sont gérés par votre appareil.

## Vos droits sur vos renseignements

Comme nous n’avons aucun moyen d’associer une clé d’exposition temporaire ou nos journaux d’accès à vous sans votre appareil, nous n’avons aucun moyen de vous fournir ou de supprimer ces renseignements de façon sécuritaire et sur demande. Cela dit, vous avez un contrôle total sur l’utilisation que vous faites de cette technologie. Votre appareil devrait vous permettre de désactiver les notifications d’exposition ou de supprimer les journaux d’exposition stockés sur celui-ci à tout moment. De plus, vous pouvez désinstaller StopCOVID à tout moment. Si vous le faites, toutes les clés de cryptage temporaires stockées par StopCOVID seront supprimées.

Si vous avez des questions ou des plaintes concernant les pratiques de StopCOVID en matière de protection de la vie privée, vous pouvez nous envoyer un courriel à [privacy@covidshield.app](mailto:privacy@covidshield.app).

Dernière mise à jour : 13 mai 2020
`;

export default privacy;
