import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  alternates: { canonical: '/end-user-aup' },
  title: 'End User Acceptable Use Policy — OSG Consortium',
  description:
    'The rules of acceptable use for the OSG Fabric of Services, which end users accept before gaining access.',
};

const CONDITIONS = [
  <>
    The services may only be used for the purpose of research or
    education/training. As a condition for access, you may be asked to provide a
    general description of the planned activities (e.g., lead investigator, field
    of science, project goals) that will be made publicly available on an OSG
    website.
  </>,
  <>
    OSG Fabric of Services does not provide services or resources that satisfy
    the security requirements for handling or processing HIPAA, PII, CUI, FERPA,
    or any other data or software protected by statute or data-use agreement. You
    agree to not introduce these types of data to OSG Fabric of Services. You
    have the responsibility for compliance with all data and software use
    agreements and other restrictions. By using the services you assert that you
    are in compliance with all laws, including copyright, and terms of services
    for data or software you place on the service.
  </>,
  <>
    You understand that OSG Fabric of Services does not guarantee that resources
    and services will be available, nor that they will suit every purpose, nor
    that data will never be lost or corrupted. These services are run
    best-effort, typically as part of research projects. Use of OSG Fabric of
    Services is at your own risk.
  </>,
  <>
    The OSG Fabric of Services is not responsible for data persistence. Best
    effort is done to avoid data loss but the services may incur data loss due to
    operator error, cybersecurity events, or to preserve operational integrity.
    You are responsible for backing up your data. In the event of ransomware
    attacks, all data will be lost. Data access protection is best effort by
    service operators; service operators have no liability if data is exposed to
    others whether due to negligence, software bugs / misconfigurations, or
    malicious activity. Service operators make no claim to ownership of any data
    or outputs produced using the OSG Fabric of Services.
  </>,
  <>
    You are responsible for securely managing your login credentials (including,
    but not limited to SSH keys, university login credentials, or credentials
    from another SSO provider). This includes not sharing your login credentials
    with any other person, including anyone representing OSG services. The
    private key of any generated keypair must always be encrypted.
  </>,
  <>
    You are responsible for abiding by operational policies and best practices,
    as described in the documentation provided by the operator of a service.
  </>,
  <>
    You agree not to use OSG Fabric of Services for any of the following:
    <ul>
      <li>direct commercial purposes</li>
      <li>any unlawful purpose</li>
      <li>cryptomining</li>
      <li>
        attempt to breach or circumvent any service’s administrative or security
        controls, within the OSG Fabric of Services or external services.
      </li>
      <li>
        violation of any agreement or terms-and-conditions of software or data
        introduced to an OSG service
      </li>
    </ul>
    You agree to comply with all applicable laws and relevant regulations, such
    as export control laws.
  </>,
  <>
    You agree to immediately report any known or suspected security breach or
    misuse of your access to{' '}
    <Link href='mailto:security@osg-htc.org'>security@osg-htc.org</Link>.
  </>,
  <>
    Logged information, including information provided by you for registration
    purposes, is used internally for administrative, operational, accounting,
    monitoring and security purposes. This data is only used for the purposes for
    which it was collected unless the service operator reasonably considers that
    it is needed for another related reason and that the reason is compatible
    with the original purpose. You authorize the collection and sharing of this
    data for the purposes described above.
  </>,
  <>
    There is no guarantee, implicit or explicit, of access to the service. As
    part of a security or AUP violation investigation or to preserve operational
    stability, service operators may suspend your access at any time.
  </>,
];

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        End User Acceptable Use Policy
      </Typography>

      <Typography paragraph>
        The operators of the OSG Fabric of Services have legal obligations to
        protect shared services and resources. You share this responsibility by
        observing and upholding the rules of acceptable use that are outlined in
        this document.
      </Typography>

      <Box fontStyle='italic'>
        <Typography component='p' fontStyle='italic'>
          The “OSG Fabric of Services” includes, but is not limited to
        </Typography>
        <ul>
          <li>
            SSH or web access to Open Science Pool (OSPool) Access Points
          </li>
          <li>Ability to place jobs to run on the OSPool</li>
          <li>
            Ability to stage and access data through the Open Science Data
            Federation (OSDF)
          </li>
          <li>
            SSH access and the ability to place jobs to run on the PATh Facility.
          </li>
        </ul>
      </Box>

      <Typography paragraph>
        Your online assent to this Acceptable Use Policy (AUP) is your
        acknowledgment that you have read, understand and accept your
        responsibilities when using OSG Fabric of Services. If you have
        questions, please contact{' '}
        <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
      </Typography>

      <Typography paragraph>
        Violations of this AUP may result in loss of access to services.
        Activities in violation of any laws will be reported to the proper
        authorities for investigation and prosecution.
      </Typography>

      <Typography paragraph>
        By using OSG Fabric of Services, you agree to comply with the following
        conditions of use:
      </Typography>

      <ol>
        {CONDITIONS.map((condition, index) => (
          <Box component='li' key={index} sx={{ mb: 2 }}>
            {condition}
          </Box>
        ))}
      </ol>

      <Typography paragraph>
        When you receive access to OSG Fabric of Services, you will be asked to
        accept and re-acknowledge your responsibilities regarding use of OSG
        Fabric of Services once a year.
      </Typography>

      <Typography paragraph>
        You shall provide appropriate acknowledgement of support or citation for
        your use of the resources/services provided as required by the body or
        bodies granting you access. More information on citing the OSPool can be
        found here:{' '}
        <Link href='/about/acknowledging'>https://osg-htc.org/acknowledging</Link>
        .
      </Typography>

      <Typography paragraph>
        This text was last updated on 29 July 2026 and can be found at{' '}
        <Link href='/end-user-aup'>https://osg-htc.org/end-user-aup</Link>.
      </Typography>
    </Container>
  );
}
