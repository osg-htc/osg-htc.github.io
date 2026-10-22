import type { Metadata } from 'next';
import Link from '@mui/material/Link';
import { Container, Divider, Typography } from '@mui/material';

export const metadata: Metadata = {
  alternates: { canonical: '/code-of-conduct' },
  title: 'OSG Code of Conduct — OSG Consortium',
  description: 'The OSG Consortium Code of Conduct.',
};

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        OSG Code of Conduct
      </Typography>
      <Typography paragraph fontStyle='italic'>
        The OSG Council, the governing body of the OSG Consortium, wrote and
        approved the OSG Code of Conduct.
      </Typography>
      <Typography paragraph>
        The OSG Consortium believes that a culture of inclusion, integrity, and
        cooperation is necessary to achieve its scientific goals, by affording all
        members the opportunity to reach their full potential. All OSG members,
        participants, vendors, staff, volunteers, conference and workshop
        attendees, invited speakers, and all other stakeholders are expected to
        conduct themselves in a professional manner that is welcoming to all and
        free from any form of discrimination, harassment, or retaliation. OSG
        members pledge to treat each other with respect and strive to model
        behaviors that encourage productive debate and allow for respectful
        disagreement.
      </Typography>
      <Typography paragraph>
        All participants in OSG activities will not engage in any inappropriate
        actions or statements that are derogatory or defamatory on the basis of
        individual characteristics such as age, race, ethnicity, sexual
        orientation, gender identity, gender expression, marital status,
        nationality, political affiliation, ability, status, educational
        background and/or socioeconomic background, neurodiversity, mental or
        physical health, or any characteristics protected by law. Disruptive or
        harassing behavior of any kind will not be tolerated. Harassment includes
        but is not limited to inappropriate or intimidating behavior and language,
        unwelcoming jokes or comments, offensive images, photography without
        permission, and stalking.
      </Typography>
      <Typography paragraph>
        Participants in OSG activities are encouraged to resolve any perceived
        breach of respectful decorum in a professional and informal manner before
        escalation. If an individual does not feel comfortable confronting the
        violation and/or believes someone has violated the code of conduct and it
        has not been addressed, they should report it by emailing{' '}
        <Link href='mailto:conduct@osg-htc.org'>conduct@osg-htc.org</Link> or
        discussing it with one of the standing OSG CoC appointees who will
        follow-up on the reported violation in a confidential manner. The
        appointees will determine ways of redressing the matter and counsel the
        parties involved. Sanctions may be issued and range from verbal warning,
        ejection from a meeting without refund, removal of subscription from a
        forum or mailing list, revocation of access to OSG services, up to
        notifying appropriate authorities. Retaliation against the CoC appointees
        or the individual(s) reporting inappropriate conduct will not be
        tolerated. Appeals of sanctions for off-meeting violations, with long term
        impacts, may be directed to the OSG Council co-chairs.
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant='body2' color='text.secondary'>
        At the moment, the OSG CoC appointees are{' '}
        <Link href='/management#executive-team'>
          the members of the OSG Executive Team
        </Link>
        .
      </Typography>
    </Container>
  );
}
