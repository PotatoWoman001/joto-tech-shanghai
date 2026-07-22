from joto_archive.issues import detect_content_issues


def test_detects_email_and_phone_mismatches_without_rewriting() -> None:
    html = """
    <a href="mailto:sales@jototechglobal.com">sales@jotoglobal.com</a>
    <a href="tel:4000875957">+86 (021) 6566 1628</a>
    """
    assert detect_content_issues(html) == [
        "email mismatch: visible=sales@jotoglobal.com href=sales@jototechglobal.com",
        "phone mismatch: visible=+86 (021) 6566 1628 href=tel:4000875957",
    ]


def test_ignores_matching_contact_links() -> None:
    html = """
    <a href="mailto:sales@example.com">Sales@example.com</a>
    <a href="tel:+8612345678">+86 123 456 78</a>
    """
    assert detect_content_issues(html) == []

